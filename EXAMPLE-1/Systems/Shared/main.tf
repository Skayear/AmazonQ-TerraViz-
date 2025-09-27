locals {

  // Shared configs 
  application_name = "Test-NAT"
  prefix           = "TN"
  env_name         = "dev"
  account_id       = "259867816695"

  availability_zones = ["${var.region}a", "${var.region}b"]
  env_full_name      = "${local.prefix}-${local.application_name}-${local.env_name}"

  vpc_name       = "${local.prefix}-${local.application_name}-VPC"
  vpc_cdir_block = "10.0.0.0/16"

  public_subnet_name = "Public ECS SubNet"
  public_subnet_list = [{
    az         = "a"
    cidr_block = "10.0.1.0/24"
    },
    {
      az         = "b"
      cidr_block = "10.0.2.0/24"
  }]

  private_subnet_name = "Private ECS SubNet"
  private_subnet_list = [{
    az         = "a"
    cidr_block = "10.0.3.0/24"
    },
    {
      az         = "b"
      cidr_block = "10.0.4.0/24"
  }]

  isolated_subnet_name = "Isolated DBs SubNet"
  isolated_subnet_list = [{
    az         = "a"
    cidr_block = "10.0.5.0/24"
    },
    {
      az         = "b"
      cidr_block = "10.0.6.0/24"
  }]

}

module "shared" {
  source = "./../../Systems/Shared"

  env_name      = local.env_name
  region        = var.region
  env_full_name = local.env_full_name

  vpc_name       = local.vpc_name
  vpc_cdir_block = local.vpc_cdir_block

  public_subnet_name = local.public_subnet_name
  public_subnet_list = local.public_subnet_list

  private_subnet_name = local.private_subnet_name
  private_subnet_list = local.private_subnet_list

  isolated_subnet_name = local.isolated_subnet_name
  isolated_subnet_list = local.isolated_subnet_list

}

# EC2 instances in public subnets
module "ec2_public" {
  source = "./../../Modules/EC2"
  count  = length(module.shared.public_subnet_ids)

  instance_name = "${local.env_full_name}-public-${count.index + 1}"
  subnet_id     = module.shared.public_subnet_ids[count.index]
  vpc_id        = module.shared.vpc_id
  vpc_cidr      = local.vpc_cdir_block
  subnet_type   = "public"
}

# EC2 instances in private subnets
module "ec2_private" {
  source = "./../../Modules/EC2"
  count  = length(module.shared.private_subnet_ids)

  instance_name = "${local.env_full_name}-private-${count.index + 1}"
  subnet_id     = module.shared.private_subnet_ids[count.index]
  vpc_id        = module.shared.vpc_id
  vpc_cidr      = local.vpc_cdir_block
  subnet_type   = "private"
}

# ECR Repository
module "ecr" {
  source = "./../../Modules/ECR"
  
  repository_name = "${local.env_full_name}-app"
}

# ECS Cluster
module "ecs" {
  source = "./../../Modules/ECS"
  
  cluster_name       = "${local.env_full_name}-cluster"
  task_family        = "${local.env_full_name}-task"
  container_name     = "${local.env_full_name}-container"
  ecr_repository_url = module.ecr.repository_url
  vpc_id             = module.shared.vpc_id
  subnet_ids         = module.shared.private_subnet_ids
}

# RDS Database
module "rds" {
  source = "./../../Modules/RDS"
  
  db_name      = "${local.env_full_name}-db"
  subnet_ids   = module.shared.isolated_subnet_ids
  vpc_id       = module.shared.vpc_id
  vpc_cidr     = local.vpc_cdir_block
  password     = "MySecurePassword123!"
}

# S3 Bucket
module "s3" {
  source = "./../../Modules/S3"
  
  bucket_name = "${local.env_full_name}-storage-${random_id.bucket_suffix.hex}"
}

resource "random_id" "bucket_suffix" {
  byte_length = 4
}

