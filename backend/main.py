from fastapi import FastAPI
from routers import schools, items, prices, orders, reports
from fastapi.middleware.cors import CORSMiddleware
import traceback
from fastapi.responses import JSONResponse


app = FastAPI(title="School Uniform MVP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom error handler to see full errors
@app.exception_handler(Exception)
async def exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": str(exc), "trace": traceback.format_exc()},
    )

app.include_router(schools.router, prefix="/schools", tags=["schools"])
app.include_router(items.router, prefix="/items", tags=["items"])
app.include_router(prices.router, prefix="/prices", tags=["prices"])
app.include_router(orders.router, prefix="/orders", tags=["orders"])
app.include_router(reports.router, prefix="/reports", tags=["reports"])

@app.get("/")
def root():
    return {"message":"OK"}
