output "repository_url" {
  description = "ECR repository URL"
  value       = aws_ecr_repository.repository.repository_url
}

output "repository_arn" {
  description = "ECR repository ARN"
  value       = aws_ecr_repository.repository.arn
}

output "registry_id" {
  description = "ECR registry ID"
  value       = aws_ecr_repository.repository.registry_id
}