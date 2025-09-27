# AWS Architecture Designer

Herramienta web moderna y minimalista para generar diagramas de arquitectura AWS basados en código Terraform con flujo de tráfico visual e interactivo.

## 🚀 Inicio Rápido

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- No requiere instalación de software adicional

### Instalación Local
1. **Clonar o descargar** los archivos del proyecto
2. **Abrir** `architecture-diagram.html` en tu navegador web
3. ¡Disfruta del nuevo diseño minimalista!

## 📁 Estructura de Archivos

```
AWS-Networking-Templates/
├── architecture-diagram.html    # Aplicación principal
├── styles.css                  # Estilos y animaciones
├── script.js                   # Lógica de generación de diagramas
├── config.js                   # Configuración de recursos
└── README.md                   # Esta documentación
```

## 🎯 Cómo Usar

### 1. Cargar Código Terraform
- **Pegar código**: En el textarea, pega tu código Terraform
- **Ejemplo incluido**: Se carga automáticamente un ejemplo funcional
- **Generar**: Haz clic en "Generar Diagrama"

### 2. Panel de Control Lateral
Usa el sidebar moderno para controlar recursos en tiempo real:

#### **🛠️ Servicios**
- 📦 **ECR Repository**: Registro de contenedores
- 🐳 **ECS Fargate**: Servicio de contenedores
- 🗄️ **RDS Database**: Base de datos MySQL
- 🗂️ **S3 Bucket**: Almacenamiento de objetos
- ⚡ **EC2 Public**: Instancias en subnets públicas
- ⚡ **EC2 Private**: Instancias en subnets privadas
- ⚖️ **Load Balancer**: Balanceador de carga

#### **🌐 Red**
- 🌍 **Internet**: Conexión externa
- ⚡ **Internet Gateway**: Gateway de internet
- 🔀 **NAT Gateway**: Gateway NAT
- 🟢 **Subnets Públicas**: Subredes con acceso directo a internet
- 🟡 **Subnets Privadas**: Subredes sin acceso directo a internet
- 🔴 **Subnets Aisladas**: Subredes completamente aisladas

#### **✨ Visual**
- 🎨 **Animaciones**: Líneas animadas de conexión
- 🏷️ **AWS Branding**: Contexto y marca AWS
- 🔗 **Conexiones**: Flujo de tráfico lineal completo

### 3. Controles Modernos
- **⚙️ Apply**: Regenera el diagrama con la nueva configuración
- **🔄 Reset**: Activa todos los recursos
- **🔄 Refresh**: Recarga completamente la aplicación (header)

## 🔧 Configuración Avanzada

### Modificar `config.js`
Puedes editar directamente el archivo para cambiar valores por defecto:

```javascript
const awsConfig = {
    services: {
        ecr: false,        // Desactivar ECR por defecto
        ecs: true,         // Mantener ECS activo
        // ...
    }
};
```

### Personalizar Estilos
Edita `styles.css` para cambiar:
- Colores de recursos
- Tamaños de fuente
- Animaciones
- Diseño responsive

## 📊 Recursos Soportados

### Servicios AWS
| Servicio | Icono | Descripción |
|----------|-------|-------------|
| ECR | 📦 | Elastic Container Registry |
| ECS | 🐳 | Elastic Container Service |
| RDS | 🗄️ | Relational Database Service |
| S3 | 🗂️ | Simple Storage Service |
| EC2 | ⚡ | Elastic Compute Cloud |
| ALB | ⚖️ | Application Load Balancer |

### Componentes de Red
| Componente | Icono | Función |
|------------|-------|---------|
| Internet | 🌐 | Conectividad externa |
| IGW | ⚡ | Internet Gateway |
| NAT | 🔀 | NAT Gateway |

## 🎨 Características Visuales

### Diseño Minimalista Moderno
- **Glassmorphism**: Efectos de vidrio esmerilado con `backdrop-filter`
- **Gradientes sutiles**: Fondos con transparencias elegantes
- **Iconos grandes**: Servicios con iconos de 48px y efectos de sombra
- **Sidebar fijo**: Panel de control organizado y accesible
- **Header sticky**: Navegación siempre visible

### Colores por Tipo de Subnet
- 🟢 **Verde**: Subnets públicas (acceso a internet)
- 🟡 **Naranja**: Subnets privadas (sin acceso directo)
- 🔴 **Rojo**: Subnets aisladas (completamente aisladas)

### Flujo de Tráfico Lineal
- **7 tipos de flujo**: Cada conexión con color y velocidad únicos
- **Líneas direccionales**: Con flechas animadas que indican dirección
- **Resplandor dinámico**: `box-shadow` que pulsa con cada línea
- **Velocidades variables**: Reflejan la naturaleza del tráfico

#### Flujos de Tráfico:
- 🟢 **Internet → IGW**: Tráfico entrante (2s)
- 🔵 **IGW → Load Balancer**: Distribución (2.5s)
- 🟠 **Load Balancer → ECS**: Balanceo (3s)
- 🔴 **ECS → RDS**: Consultas DB (3.5s)
- 🟣 **ECR → ECS**: Pull imágenes (4s)
- 🟦 **S3 → ECS**: Almacenamiento (4.5s)
- 🟡 **NAT → Private**: Salida internet (2.8s)

## 🛠️ Casos de Uso

### 1. **Presentaciones Ejecutivas**
- Diseño minimalista perfecto para audiencias C-level
- Desactivar recursos no relevantes para simplificar
- Mostrar flujo de tráfico en tiempo real
- Iconos grandes y claros para proyección

### 2. **Documentación Técnica**
- Generar diagramas profesionales para documentos
- Explicar flujos de datos con líneas direccionales
- Mostrar diferentes configuraciones con toggles
- Capturar pantallas sin animaciones

### 3. **Educación y Training**
- Enseñar conceptos de AWS con visualización moderna
- Demostrar mejores prácticas paso a paso
- Comparar arquitecturas activando/desactivando servicios
- Mostrar flujo completo de tráfico

### 4. **Desarrollo y DevOps**
- Visualizar infraestructura como código
- Validar configuraciones Terraform visualmente
- Planificar cambios de arquitectura
- Debuggear problemas de conectividad

### 5. **Demos y Workshops**
- Interface moderna que impresiona a la audiencia
- Control en tiempo real para demos interactivas
- Flujo de tráfico visual para explicar conceptos
- Sidebar organizado para navegación rápida

## 🔍 Solución de Problemas

### El diagrama no se genera
- ✅ Verificar que el código Terraform tenga la sintaxis correcta
- ✅ Asegurar que los módulos estén definidos correctamente
- ✅ Revisar la consola del navegador para errores

### Recursos no aparecen
- ✅ Verificar que estén habilitados en el panel de control
- ✅ Confirmar que el código Terraform incluya los módulos
- ✅ Aplicar cambios después de modificar configuración

### Animaciones no funcionan
- ✅ Activar "Animaciones" en el panel visual
- ✅ Verificar compatibilidad del navegador
- ✅ Refrescar la página

## 📝 Ejemplo de Código Terraform

```hcl
# Configuración completa que la herramienta puede procesar
locals {
  vpc_name = "Mi-VPC"
  vpc_cdir_block = "10.0.0.0/16"
  
  public_subnet_list = [{
    az = "a"
    cidr_block = "10.0.1.0/24"
  }]
  
  private_subnet_list = [{
    az = "a" 
    cidr_block = "10.0.2.0/24"
  }]
  
  isolated_subnet_list = [{
    az = "a"
    cidr_block = "10.0.3.0/24"
  }]
}

module "ecr" {
  source = "./modules/ECR"
}

module "ecs" {
  source = "./modules/ECS"
}

module "rds" {
  source = "./modules/RDS"
}

module "s3" {
  source = "./modules/S3"
}

module "ec2_public" {
  source = "./modules/EC2"
}

module "ec2_private" {
  source = "./modules/EC2"
}
```

## 🤝 Contribuir

Para mejorar la herramienta:
1. Modifica los archivos según necesidades
2. Prueba cambios en navegador
3. Documenta nuevas características

## 📄 Licencia

Herramienta de uso libre para proyectos personales y comerciales.

---

**¿Necesitas ayuda?** Revisa el código fuente o modifica los archivos según tus necesidades específicas.