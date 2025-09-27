variable "cluster_name" {
  description = "Name for the ECS cluster"
  type        = string
}

variable "task_family" {
  description = "ECS task definition family"
  type        = string
}

variable "container_name" {
  description = "Container name"
  type        = string
}

variable "ecr_repository_url" {
  description = "ECR repository URL"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "subnet_ids" {
  description = "List of subnet IDs for ECS service"
  type        = list(string)
}