from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import BaseModel


class SystemLogBase(BaseModel):
    level: str
    module: str
    message: str
    details: Optional[Dict[str, Any]] = None


class SystemLogCreate(SystemLogBase):
    pass


class SystemLogResponse(SystemLogBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
