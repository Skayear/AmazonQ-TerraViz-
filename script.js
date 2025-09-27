function parseTerraform(terraformCode) {
    const config = {
        vpc: {},
        subnets: {
            public: [],
            private: [],
            isolated: []
        },
        availabilityZones: [],
        services: {
            ecr: false,
            ecs: false,
            rds: false,
            ec2_public: false,
            ec2_private: false
        }
    };

    // Extraer VPC
    const vpcNameMatch = terraformCode.match(/vpc_name\s*=\s*"([^"]+)"/);
    const vpcCidrMatch = terraformCode.match(/vpc_cdir_block\s*=\s*"([^"]+)"/);
    
    if (vpcNameMatch) config.vpc.name = vpcNameMatch[1];
    if (vpcCidrMatch) config.vpc.cidr = vpcCidrMatch[1];

    // Extraer availability zones
    const azMatch = terraformCode.match(/availability_zones\s*=\s*\[(.*?)\]/s);
    if (azMatch) {
        const azList = azMatch[1].match(/"([^"]+)"/g);
        if (azList) {
            config.availabilityZones = azList.map(az => az.replace(/"/g, ''));
        }
    }

    // Extraer subnets públicas
    const publicSubnetsMatch = terraformCode.match(/public_subnet_list\s*=\s*\[(.*?)\]/s);
    if (publicSubnetsMatch) {
        config.subnets.public = parseSubnetList(publicSubnetsMatch[1]);
    }

    // Extraer subnets privadas
    const privateSubnetsMatch = terraformCode.match(/private_subnet_list\s*=\s*\[(.*?)\]/s);
    if (privateSubnetsMatch) {
        config.subnets.private = parseSubnetList(privateSubnetsMatch[1]);
    }

    // Extraer subnets aisladas
    const isolatedSubnetsMatch = terraformCode.match(/isolated_subnet_list\s*=\s*\[(.*?)\]/s);
    if (isolatedSubnetsMatch) {
        config.subnets.isolated = parseSubnetList(isolatedSubnetsMatch[1]);
    }

    // Detectar servicios y aplicar configuración
    config.services.ecr = /module\s+["']ecr["']/.test(terraformCode) && awsConfig.services.ecr;
    config.services.ecs = /module\s+["']ecs["']/.test(terraformCode) && awsConfig.services.ecs;
    config.services.rds = /module\s+["']rds["']/.test(terraformCode) && awsConfig.services.rds;
    config.services.ec2_public = /module\s+["']ec2_public["']/.test(terraformCode) && awsConfig.services.ec2_public;
    config.services.ec2_private = /module\s+["']ec2_private["']/.test(terraformCode) && awsConfig.services.ec2_private;
    config.services.s3 = /module\s+["']s3["']/.test(terraformCode) && awsConfig.services.s3;
    config.services.alb = awsConfig.services.alb;

    return config;
}

function parseSubnetList(subnetString) {
    const subnets = [];
    const subnetBlocks = subnetString.match(/\{[^}]+\}/g);
    
    if (subnetBlocks) {
        subnetBlocks.forEach(block => {
            const azMatch = block.match(/az\s*=\s*"([^"]+)"/);
            const cidrMatch = block.match(/cidr_block\s*=\s*"([^"]+)"/);
            
            if (azMatch && cidrMatch) {
                subnets.push({
                    az: azMatch[1],
                    cidr: cidrMatch[1]
                });
            }
        });
    }
    
    return subnets;
}

function generateDiagram() {
    const terraformCode = document.getElementById('terraformInput').value;
    const diagramContainer = document.getElementById('diagram');
    
    if (!terraformCode.trim()) {
        diagramContainer.innerHTML = '<p>Por favor, ingresa código de Terraform para generar el diagrama.</p>';
        return;
    }

    const config = parseTerraform(terraformCode);
    
    let html = `
        <!-- AWS Cloud Container -->
        <div class="aws-cloud">
            <div class="aws-header">
                <div class="aws-logo">☁️</div>
                <div class="aws-title">Amazon Web Services</div>
                <div class="aws-region">Region: ${getRegionFromConfig(config)}</div>
            </div>
            
            <div class="legend">
                <div class="legend-item">
                    <div class="legend-color public"></div>
                    <span>Subnets Públicas</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color private"></div>
                    <span>Subnets Privadas</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color isolated"></div>
                    <span>Subnets Aisladas</span>
                </div>
                <div class="legend-item">
                    <div class="traffic-line"></div>
                    <span>Flujo de Tráfico</span>
                </div>
            </div>
        
        <div class="info-box">
            <div class="info-title">Información de la VPC</div>
            <div><strong>Nombre:</strong> ${config.vpc.name || 'No especificado'}</div>
            <div><strong>CIDR:</strong> ${config.vpc.cidr || 'No especificado'}</div>
            <div><strong>Rango IP:</strong> ${getIpRange(config.vpc.cidr)}</div>
        </div>
        
        <!-- AWS Services -->
        <div class="aws-services">
            ${config.services.ecr ? `
            <div class="service-item ecr">
                <div class="service-icon">📦</div>
                <div class="service-label">ECR Repository</div>
            </div>` : ''}
            ${config.services.s3 ? `
            <div class="service-item s3">
                <div class="service-icon">🗄️</div>
                <div class="service-label">S3 Bucket</div>
            </div>` : ''}
        </div>
        
        ${awsConfig.network.internet ? `
        <!-- Internet -->
        <div class="internet">
            <div class="internet-icon">🌐</div>
            <div class="internet-label">Internet</div>
        </div>` : ''}
        
        ${awsConfig.network.igw ? `
        <!-- Internet Gateway -->
        <div class="internet-gateway">
            <div class="igw-icon">⚡</div>
            <div class="igw-label">Internet Gateway</div>
        </div>` : ''}
        
        <div class="vpc">
            <div class="vpc-title">${config.vpc.name || 'VPC'} (${config.vpc.cidr})</div>
            
            ${awsConfig.network.nat ? `
            <!-- NAT Gateway -->
            <div class="nat-gateway">
                <div class="nat-icon">🔀</div>
                <div class="nat-label">NAT Gateway</div>
            </div>` : ''}
    `;

    // Generar AZs
    const uniqueAZs = [...new Set([
        ...config.subnets.public.map(s => s.az),
        ...config.subnets.private.map(s => s.az),
        ...config.subnets.isolated.map(s => s.az)
    ])];

    uniqueAZs.forEach((az, azIndex) => {
        html += `
            <div class="availability-zone" data-az="${az}">
                <div class="az-title">Availability Zone ${az}</div>
        `;

        // Subnets públicas en esta AZ
        if (awsConfig.network.public_subnets) {
        config.subnets.public.filter(s => s.az === az).forEach((subnet, index) => {
            const ipRange = getIpRange(subnet.cidr);
            html += `
                <div class="subnet public" data-type="public" data-az="${az}">
                    <div class="subnet-header">
                        <div class="subnet-title">Subnet Pública</div>
                        <div class="subnet-cidr">${subnet.cidr}</div>
                        <div class="ip-range">IPs: ${ipRange}</div>
                    </div>
                    <div class="subnet-resources">
                        ${config.services.ec2_public ? `
                        <div class="resource-box ec2-box">
                            <div class="resource-icon-bg">
                                <div class="aws-icon ec2-icon">⚡</div>
                            </div>
                            <div class="resource-info">
                                <div class="resource-name">EC2 Instance</div>
                                <div class="resource-ip">${getRandomIp(subnet.cidr)}</div>
                            </div>
                        </div>` : ''}
                        ${awsConfig.services.alb ? `
                        <div class="resource-box alb-box">
                            <div class="resource-icon-bg">
                                <div class="aws-icon alb-icon">⚖️</div>
                            </div>
                            <div class="resource-info">
                                <div class="resource-name">Load Balancer</div>
                                <div class="resource-status">Active</div>
                            </div>
                        </div>` : ''}
                    </div>
                </div>
            `;
        });
        }

        // Subnets privadas en esta AZ
        if (awsConfig.network.private_subnets) {
        config.subnets.private.filter(s => s.az === az).forEach((subnet, index) => {
            const ipRange = getIpRange(subnet.cidr);
            html += `
                <div class="subnet private" data-type="private" data-az="${az}">
                    <div class="subnet-header">
                        <div class="subnet-title">Subnet Privada</div>
                        <div class="subnet-cidr">${subnet.cidr}</div>
                        <div class="ip-range">IPs: ${ipRange}</div>
                    </div>
                    <div class="subnet-resources">
                        ${config.services.ec2_private ? `
                        <div class="resource-box ec2-box">
                            <div class="resource-icon-bg">
                                <div class="aws-icon ec2-icon">⚡</div>
                            </div>
                            <div class="resource-info">
                                <div class="resource-name">EC2 Instance</div>
                                <div class="resource-ip">${getRandomIp(subnet.cidr)}</div>
                            </div>
                        </div>` : ''}
                        ${config.services.ecs ? `
                        <div class="resource-box ecs-box">
                            <div class="resource-icon-bg">
                                <div class="aws-icon ecs-icon">🐳</div>
                            </div>
                            <div class="resource-info">
                                <div class="resource-name">ECS Fargate</div>
                                <div class="resource-status">2 tasks</div>
                            </div>
                        </div>` : ''}
                    </div>
                </div>
            `;
        });
        }

        // Subnets aisladas en esta AZ
        if (awsConfig.network.isolated_subnets) {
        config.subnets.isolated.filter(s => s.az === az).forEach((subnet, index) => {
            const ipRange = getIpRange(subnet.cidr);
            html += `
                <div class="subnet isolated" data-type="isolated" data-az="${az}">
                    <div class="subnet-header">
                        <div class="subnet-title">Subnet Aislada</div>
                        <div class="subnet-cidr">${subnet.cidr}</div>
                        <div class="ip-range">IPs: ${ipRange}</div>
                    </div>
                    <div class="subnet-resources">
                        ${config.services.rds ? `
                        <div class="resource-box rds-box">
                            <div class="resource-icon-bg">
                                <div class="aws-icon rds-icon">🗄️</div>
                            </div>
                            <div class="resource-info">
                                <div class="resource-name">RDS MySQL</div>
                                <div class="resource-ip">${getRandomIp(subnet.cidr)}</div>
                                <div class="resource-status">Multi-AZ</div>
                            </div>
                        </div>` : ''}
                    </div>
                </div>
            `;
        });
        }

        html += '</div>';
    });

    html += `
            </div>
        </div>
        <!-- End AWS Cloud -->
    `;
    
    diagramContainer.innerHTML = html;
    
    // Agregar líneas de conexión después de renderizar
    setTimeout(() => drawConnections(), 100);
}

function getIpRange(cidr) {
    if (!cidr) return 'N/A';
    const [network, prefix] = cidr.split('/');
    const hostBits = 32 - parseInt(prefix);
    const totalIps = Math.pow(2, hostBits);
    const usableIps = totalIps - 2; // Restar network y broadcast
    return `${usableIps} IPs disponibles`;
}

function getRandomIp(cidr) {
    if (!cidr) return '10.0.0.10';
    const [network] = cidr.split('/');
    const parts = network.split('.');
    const lastOctet = Math.floor(Math.random() * 200) + 10; // Entre 10-210
    return `${parts[0]}.${parts[1]}.${parts[2]}.${lastOctet}`;
}

function getRegionFromConfig(config) {
    // Extraer región de availability zones o usar default
    if (config.availabilityZones.length > 0) {
        const az = config.availabilityZones[0];
        return az.slice(0, -1); // Remover la letra final (a, b, c)
    }
    return 'us-east-1';
}

function drawConnections() {
    const container = document.querySelector('.diagram-area');
    if (!container) return;
    
    // Limpiar líneas existentes
    const existingLines = container.querySelectorAll('.connection-line');
    existingLines.forEach(line => line.remove());
    
    if (!awsConfig.connections.ecr_ecs) return;
    
    // Flujo completo de tráfico
    const internet = container.querySelector('.internet');
    const igw = container.querySelector('.internet-gateway');
    const nat = container.querySelector('.nat-gateway');
    const publicSubnets = container.querySelectorAll('.subnet.public');
    const privateSubnets = container.querySelectorAll('.subnet.private');
    const isolatedSubnets = container.querySelectorAll('.subnet.isolated');
    const albBoxes = container.querySelectorAll('.alb-box');
    const ecsBoxes = container.querySelectorAll('.ecs-box');
    const rdsBoxes = container.querySelectorAll('.rds-box');
    const ecr = container.querySelector('.service-item.ecr');
    const s3 = container.querySelector('.service-item.s3');
    
    // 1. Internet -> IGW
    if (internet && igw) {
        drawTrafficLine(internet, igw, 'traffic-flow-1');
    }
    
    // 2. IGW -> Load Balancers en subnets públicas
    if (igw && albBoxes.length > 0) {
        albBoxes.forEach(alb => {
            drawTrafficLine(igw, alb, 'traffic-flow-2');
        });
    }
    
    // 3. Load Balancers -> ECS en subnets privadas
    if (albBoxes.length > 0 && ecsBoxes.length > 0) {
        albBoxes.forEach((alb, index) => {
            if (ecsBoxes[index]) {
                drawTrafficLine(alb, ecsBoxes[index], 'traffic-flow-3');
            }
        });
    }
    
    // 4. ECS -> RDS en subnets aisladas
    if (ecsBoxes.length > 0 && rdsBoxes.length > 0) {
        ecsBoxes.forEach((ecs, index) => {
            if (rdsBoxes[index]) {
                drawTrafficLine(ecs, rdsBoxes[index], 'traffic-flow-4');
            }
        });
    }
    
    // 5. ECR -> ECS (pull de imágenes)
    if (ecr && ecsBoxes.length > 0) {
        ecsBoxes.forEach(ecs => {
            drawTrafficLine(ecr, ecs, 'traffic-flow-5');
        });
    }
    
    // 6. S3 -> ECS (almacenamiento)
    if (s3 && ecsBoxes.length > 0) {
        ecsBoxes.forEach(ecs => {
            drawTrafficLine(s3, ecs, 'traffic-flow-6');
        });
    }
    
    // 7. NAT -> Subnets privadas (salida a internet)
    if (nat && privateSubnets.length > 0) {
        privateSubnets.forEach(subnet => {
            drawTrafficLine(nat, subnet, 'traffic-flow-7');
        });
    }
}

function drawTrafficLine(element1, element2, flowClass) {
    const container = document.querySelector('.diagram-area');
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    const x1 = rect1.left + rect1.width / 2 - containerRect.left;
    const y1 = rect1.top + rect1.height / 2 - containerRect.top;
    const x2 = rect2.left + rect2.width / 2 - containerRect.left;
    const y2 = rect2.top + rect2.height / 2 - containerRect.top;
    
    const line = document.createElement('div');
    line.className = `traffic-line ${flowClass}`;
    
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    
    line.style.width = `${length}px`;
    line.style.left = `${x1}px`;
    line.style.top = `${y1}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.transformOrigin = '0 50%';
    
    // Agregar flecha direccional
    const arrow = document.createElement('div');
    arrow.className = 'traffic-arrow';
    line.appendChild(arrow);
    
    container.appendChild(line);
}

// Funciones de control de configuración
function updateConfig() {
    // Servicios
    awsConfig.services.ecr = document.getElementById('ecr').checked;
    awsConfig.services.ecs = document.getElementById('ecs').checked;
    awsConfig.services.rds = document.getElementById('rds').checked;
    awsConfig.services.s3 = document.getElementById('s3').checked;
    awsConfig.services.ec2_public = document.getElementById('ec2_public').checked;
    awsConfig.services.ec2_private = document.getElementById('ec2_private').checked;
    awsConfig.services.alb = document.getElementById('alb').checked;
    
    // Red
    awsConfig.network.internet = document.getElementById('internet').checked;
    awsConfig.network.igw = document.getElementById('igw').checked;
    awsConfig.network.nat = document.getElementById('nat').checked;
    awsConfig.network.public_subnets = document.getElementById('public_subnets').checked;
    awsConfig.network.private_subnets = document.getElementById('private_subnets').checked;
    awsConfig.network.isolated_subnets = document.getElementById('isolated_subnets').checked;
    
    // Visual
    awsConfig.visual.animations = document.getElementById('animations').checked;
    awsConfig.visual.aws_branding = document.getElementById('aws_branding').checked;
    awsConfig.connections.ecr_ecs = document.getElementById('connections').checked;
    
    // Regenerar diagrama
    generateDiagram();
}

function resetConfig() {
    // Resetear todos los checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
    
    // Resetear configuración
    Object.keys(awsConfig.services).forEach(key => awsConfig.services[key] = true);
    Object.keys(awsConfig.network).forEach(key => awsConfig.network[key] = true);
    Object.keys(awsConfig.visual).forEach(key => awsConfig.visual[key] = true);
    Object.keys(awsConfig.connections).forEach(key => awsConfig.connections[key] = true);
    
    generateDiagram();
}

// Cargar ejemplo automáticamente
window.onload = function() {
    const exampleTerraform = `locals {
  application_name = "Test-NAT"
  prefix           = "TN"
  env_name         = "dev"
  
  availability_zones = ["us-east-1a", "us-east-1b"]
  
  vpc_name       = "TN-Test-NAT-VPC"
  vpc_cdir_block = "10.0.0.0/16"
  
  public_subnet_list = [{
    az         = "a"
    cidr_block = "10.0.1.0/24"
    },
    {
      az         = "b"
      cidr_block = "10.0.2.0/24"
  }]
  
  private_subnet_list = [{
    az         = "a"
    cidr_block = "10.0.3.0/24"
    },
    {
      az         = "b"
      cidr_block = "10.0.4.0/24"
  }]
  
  isolated_subnet_list = [{
    az         = "a"
    cidr_block = "10.0.5.0/24"
    },
    {
      az         = "b"
      cidr_block = "10.0.6.0/24"
  }]
}

# EC2 instances in public subnets
module "ec2_public" {
  source = "./../../Modules/EC2"
  count  = length(module.shared.public_subnet_ids)
  
  instance_name = "TN-Test-NAT-dev-public"
  subnet_type   = "public"
}

# EC2 instances in private subnets  
module "ec2_private" {
  source = "./../../Modules/EC2"
  count  = length(module.shared.private_subnet_ids)
  
  instance_name = "TN-Test-NAT-dev-private"
  subnet_type   = "private"
}

# ECR Repository
module "ecr" {
  source = "./../../Modules/ECR"
  repository_name = "TN-Test-NAT-dev-app"
}

# ECS Cluster
module "ecs" {
  source = "./../../Modules/ECS"
  cluster_name = "TN-Test-NAT-dev-cluster"
  ecr_repository_url = module.ecr.repository_url
}

# RDS Database
module "rds" {
  source = "./../../Modules/RDS"
  db_name = "TN-Test-NAT-dev-db"
  subnet_ids = module.shared.isolated_subnet_ids
}

# S3 Bucket
module "s3" {
  source = "./../../Modules/S3"
  bucket_name = "TN-Test-NAT-dev-storage"
}`;
    
    document.getElementById('terraformInput').value = exampleTerraform;
    generateDiagram();
};