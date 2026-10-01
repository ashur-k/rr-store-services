from fastapi import FastAPI

app = FastAPI(title="Store Service", root_path="/api/stores")


@app.get("/health/")
def health_check():
    return {"status": "ok"}