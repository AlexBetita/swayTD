import json

from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user

from app.models import Map, db


map_routes = Blueprint('maps', __name__)


@map_routes.route('/', methods=['GET'])
@login_required
def maps():
    maps = Map.query.all()
    return {'maps': [map_.to_dict() for map_ in maps]}


@map_routes.route('/player')
@login_required
def players_maps():
    user = current_user
    maps = Map.query.filter(Map.user_id == user.id).all()
    return {'maps': [map_.to_dict() for map_ in maps]}


@map_routes.route('/', methods=['POST'])
@login_required
def create_map():
    data = request.get_json()
    user = current_user
    map_ = Map(
        name=data['name'],
        map_data=json.dumps(data['map_data']),
        user_id=user.id,
        rows=data['rows'],
        columns=data['columns'],
        width=data['width'],
        height=data['height'],
        map_image=data['map_image']
    )
    db.session.add(map_)
    db.session.commit()
    return map_.to_dict()


@map_routes.route('/<int:id>', methods=['GET', 'DELETE', 'PUT'])
@login_required
def get_map(id):
    map_ = Map.query.get(id)
    if map_:
        if request.method == 'DELETE':
            db.session.delete(map_)
            db.session.commit()
            id_ = id
            return {"id": id_}
        if request.method == 'PUT':
            data = request.get_json()
            if map_.name != data['name']:
                exists = Map.query.filter(Map.name == data['name']).first()
                if exists:
                    return {'errors': ['Name is already taken']}, 400
            map_.width = data['width']
            map_.height = data['height']
            map_.rows = data['rows']
            map_.columns = data['columns']
            map_.map_data = json.dumps(data['map_data'])
            map_.name = data['name']
            map_.map_image = data['name']
            db.session.commit()
            return map_.to_dict()
        else:
            return map_.to_dict()
    return {'errors': ['map does not exist']}, 400
