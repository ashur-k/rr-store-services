from fastapi import FastAPI

from app.routers import api_router

app = FastAPI(
    title="Product Service",
    root_path="/api/products",
)

app.include_router(api_router)
