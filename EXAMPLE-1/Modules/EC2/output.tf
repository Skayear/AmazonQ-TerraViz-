output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.ec2.id
}

output "private_ip" {
  description = "Private IP address of the EC2 instance"
  value       = aws_instance.ec2.private_ip
}

output "security_group_id" {
  description = "ID of the security group"
  value       = aws_security_group.ec2_sg.id
}