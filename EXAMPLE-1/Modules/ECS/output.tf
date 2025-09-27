output "cluster_id" {
  description = "ECS cluster ID"
  value       = aws_ecs_cluster.cluster.id
}

output "cluster_arn" {
  description = "ECS cluster ARN"
  value       = aws_ecs_cluster.cluster.arn
}

output "task_definition_arn" {
  description = "ECS task definition ARN"
  value       = aws_ecs_task_definition.task.arn
}

output "security_group_id" {
  description = "ECS security group ID"
  value       = aws_security_group.ecs_sg.id
}