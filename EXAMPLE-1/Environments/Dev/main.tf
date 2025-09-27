module "VPC" {
  source = "../../Modules/VPC"

  env_name = var.env_name
  vpc_name = var.vpc_name
  vpc_cdir_block = var.vpc_cdir_block
}

module "private_subnets" {
  source = "../../Modules/Subnet-private-dev"
 
  env_name = var.env_name 
  region = var.region

  vpc_id = module.VPC.vpc_id
  igw_id = module.VPC.igw_id

  subnet_name = var.private_subnet_name  
  subnet_list = var.private_subnet_list
  privacy = "private"

}

module "public_subnets" {
  source = "../../Modules/Subnet-public-dev"
 
  env_name = var.env_name 
  region = var.region

  vpc_id = module.VPC.vpc_id
  igw_id = module.VPC.igw_id
  
  subnet_name = var.public_subnet_name
  subnet_list = var.public_subnet_list 
  privacy = "public"

}

module "isolated_subnets" {
  source = "../../Modules/Subnet"
 
  env_name = var.env_name 
  region = var.region

  vpc_id = module.VPC.vpc_id 
  igw_id = module.VPC.igw_id
  
  subnet_name = var.isolated_subnet_name
  subnet_list = var.isolated_subnet_list 
  privacy = "isolated"

}
