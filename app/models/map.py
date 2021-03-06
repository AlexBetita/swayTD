import datetime
import json

from sqlalchemy.schema import ForeignKey
from sqlalchemy import event

from .db import db


class Map(db.Model):
    __tablename__ = 'maps'
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    map_data = db.Column(db.Text, nullable=False)
    rows = db.Column(db.Integer, nullable=False)
    columns = db.Column(db.Integer, nullable=False)
    height = db.Column(db.Integer, nullable=False)
    width = db.Column(db.Integer, nullable=False)
    map_image = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    user = db.relationship('User')

    def to_dict(self):
        return {
            'name': self.name,
            'map_data': self.map_data,
            'user_id': self.user_id,
            'id': self.id,
            'map_image': self.map_image,
            'rows': self.rows,
            'columns': self.columns,
            'height': self.height,
            'width': self.width,
            'username': self.user.username,
            'profileImage': self.user.profileImage,
            }

    # def to_dict_with_index(self, index=0):
    #     offset = 15
    #     maps = {}
    #     for i in
    #     return maps

# Credits
# https://stackoverflow.com/questions/9234082/setting-delete-orphan-on-sqlalchemy-relationship-causes-assertionerror-this-att


# @event.listens_for(db.session, 'after_flush')
# def delete_map_orphans(session, ctx):
#     session.query(Map).\
#         filter(~Map.user_score.any()).\
#         delete(synchronize_session=False)
