from .db import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
import datetime
from sqlalchemy import event
import json

user_scores = db.Table(
  'user_scores',
  db.Column(
    "user_id",
    db.Integer,
    db.ForeignKey("users.id", ondelete='cascade'),
    primary_key=True
  ),
  db.Column(
    "map_id",
    db.Integer,
    db.ForeignKey("maps.id", ondelete='cascade'),
    primary_key=True
  ),
  db.Column(
    'score',
    db.BigInteger,
    nullable=False
  )
)


class User(db.Model, UserMixin):
    __tablename__ = 'users'
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    currency = db.Column(db.BigInteger, default=0)
    profileImage = db.Column(db.String(256))
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    map = db.relationship('Map', lazy='dynamic', foreign_keys='Map.user_id')

    map_scores = db.relationship(
      'Map',
      secondary=user_scores,
      primaryjoin=(user_scores.c.user_id == id),
      backref=db.backref('user_score', lazy='dynamic',
                         cascade="all, delete-orphan",
                         single_parent=True),
      lazy='dynamic'
    )

    # map_scores = db.relationship(
    #   'Map',
    #   secondary=user_scores,
    #   primaryjoin=(user_scores.c.user_id == id),
    #   backref=db.backref('user_score', lazy='dynamic'),
    #   lazy='dynamic'
    #   )

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        maps = {}
        for i in self.map.all():
            maps[i.id] = {
                'name': i.name,
                'map_data': i.map_data,
                'rows': i.rows,
                'columns': i.columns,
                'height': i.height,
                'width': i.width,
                'id': i.id,
                'map_image': i.map_image,
                'user_id': self.id
            }
        return {
          "id": self.id,
          "username": self.username,
          "email": self.email,
          "currency": self.currency,
          "profileImage": self.profileImage,
          "maps": maps
        }
