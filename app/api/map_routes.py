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
        user_id=user.id
    )
    db.session.add(map_)
    db.session.commit()
    return map_.to_dict()


@map_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_map(id):
    print('AHHH AYEMBA MOMBA LEE')
    map_ = Map.query.get(id)
    if map_:
        return map_.to_dict()
    return {'errors': 'map does not exist'}, 400
