import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from motor.motor_asyncio import AsyncIOMotorClient
import logging

logger = logging.getLogger("SignLangAI.Database")

# ==========================================
# MySQL Configuration (SQLAlchemy)
# ==========================================
# Default fallback to your local system's MySQL
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "root") # Common default password for local MySQL
MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
MYSQL_DB = os.getenv("MYSQL_DB", "signlangai_db")

MYSQL_URL = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"

try:
    engine = create_engine(MYSQL_URL, echo=False)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()
except Exception as e:
    logger.error(f"Failed to initialize MySQL Engine: {e}")
    engine = None
    SessionLocal = None
    Base = None

def get_mysql_db():
    if SessionLocal:
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()
    else:
        yield None

# ==========================================
# MongoDB Configuration (Motor)
# ==========================================
# Default fallback to your local system's MongoDB
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "signlangai_logs")

try:
    mongo_client = AsyncIOMotorClient(MONGO_URL)
    mongo_db = mongo_client[MONGO_DB_NAME]
    prediction_collection = mongo_db["predictions"]
except Exception as e:
    logger.error(f"Failed to initialize MongoDB Client: {e}")
    mongo_client = None
    mongo_db = None
    prediction_collection = None
