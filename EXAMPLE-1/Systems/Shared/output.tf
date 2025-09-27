
output "private_subnet_ids" {
  value = module.private_subnets.subnet_ids
}
 
output "public_subnet_ids" {
  value = module.public_subnets.subnet_ids
}

output "vpc_id" {
  value = module.VPC.vpc_id
}

output "isolated_subnet_ids" {
  value = module.isolated_subnets.subnet_ids
}