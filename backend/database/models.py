from sqlalchemy import Column

from sqlalchemy import Integer

from sqlalchemy import Float

from sqlalchemy import DateTime

from sqlalchemy.orm import declarative_base

from datetime import datetime


Base = declarative_base()


class PredictionLog(Base):

    __tablename__ = "prediction_logs"

    id = Column(

        Integer,

        primary_key=True,

        index=True

    )

    amount = Column(

        Float

    )

    prediction = Column(

        Integer

    )

    fraud_probability = Column(

        Float

    )

    created_at = Column(

        DateTime,

        default=datetime.utcnow

    )