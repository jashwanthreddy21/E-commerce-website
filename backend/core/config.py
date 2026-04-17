import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "E-Commerce API"
    SECRET_KEY: str = "SUP3R_S3CR3T_K3Y_CH4NG3_IN_PR0DUCT10N"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # DB Configuration
    # Defaults to SQLite for local development without MySQL installed
    # To use MySQL, set the env vars: MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST, MYSQL_PORT, MYSQL_DB
    MYSQL_USER: str = os.getenv("MYSQL_USER", "")
    MYSQL_PASSWORD: str = os.getenv("MYSQL_PASSWORD", "")
    MYSQL_HOST: str = os.getenv("MYSQL_HOST", "")
    MYSQL_PORT: str = os.getenv("MYSQL_PORT", "3306")
    MYSQL_DB: str = os.getenv("MYSQL_DB", "")
    
    @property
    def DATABASE_URL(self) -> str:
        # Direct DATABASE_URL override (used in production on Render with PostgreSQL)
        direct_url = os.getenv("DATABASE_URL", "")
        if direct_url:
            # Render provides postgres:// but SQLAlchemy requires postgresql://
            return direct_url.replace("postgres://", "postgresql://", 1)
        if self.MYSQL_USER and self.MYSQL_HOST and self.MYSQL_DB:
            return f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DB}"
        # Fallback to SQLite for local development
        import os as _os
        base_dir = _os.path.dirname(_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__))))
        db_path = _os.path.join(base_dir, "sql_app.db")
        return f"sqlite:///{db_path}"

settings = Settings()
