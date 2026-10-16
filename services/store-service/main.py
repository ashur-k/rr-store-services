from contextlib import asynccontextmanager
from threading import Thread

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.messaging.consumer import consume
from app.routers import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    consumer_thread = Thread(
        target=consume,
        name="rabbitmq-consumer",
        daemon=True,
    )
    consumer_thread.start()

    yield


app = FastAPI(title="Store Service", root_path="/api/stores", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
