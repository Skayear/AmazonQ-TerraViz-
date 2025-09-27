// Configuración de recursos AWS
const awsConfig = {
    // Servicios principales
    services: {
        ecr: true,
        ecs: true,
        rds: true,
        s3: true,
        ec2_public: true,
        ec2_private: true,
        alb: true
    },
    
    // Componentes de red
    network: {
        internet: true,
        igw: true,
        nat: true,
        public_subnets: true,
        private_subnets: true,
        isolated_subnets: true
    },
    
    // Conexiones
    connections: {
        internet_igw: true,
        igw_public: true,
        nat_private: true,
        private_isolated: true,
        ecr_ecs: true
    },
    
    // Configuración visual
    visual: {
        aws_branding: true,
        animations: true,
        region_display: true
    }
};