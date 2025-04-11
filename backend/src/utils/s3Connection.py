import boto3
from botocore.exceptions import ClientError
from src.config import AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION


s3_client = boto3.client(
    "s3",
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
)

def generate_presigned_url(bucket_name: str, object_name: str, content_type: str, expiration=3600):
    try:
        response = s3_client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": bucket_name,
                "Key": object_name,
                "ContentType": content_type
            },
            ExpiresIn=expiration
        )
        return response
    except ClientError as e:
        print(f"Error generating presigned URL: {e}")
        return None
