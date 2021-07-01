from .db import db
from sqlalchemy.schema import ForeignKey
import datetime

class Map(db.Model):
    __tablename__ = 'maps'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    map_data = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, ForeignKey('users.id'), nullable=False)
    created_at=db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at=db.Column(db.DateTime, default=datetime.datetime.utcnow)

    user= db.relationship('User')
