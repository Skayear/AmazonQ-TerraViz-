/*====
The VPC
======*/
resource "aws_default_vpc" "default" {
  tags = {
    Name        = var.prefix
    Environment = var.prefix
  }
}

resource "aws_default_subnet" "default_az1" {
  availability_zone = "${var.region}a"
}

resource "aws_default_subnet" "default_az2" {
  availability_zone = "${var.region}b"
}

resource "aws_security_group" "internal" {
  vpc_id      = aws_default_vpc.default.id
  name        = "${var.env_full_name}-internal"
  description = "All ${var.env_full_name} resources in one SG"

  tags = {
    Name        = "${var.env_full_name}-internal"
    Environment = var.environment
  }
}

