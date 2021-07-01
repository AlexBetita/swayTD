import json

from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user

from app.models import Map, db


map_routes = Blueprint('maps', __name__)


@map_routes.route('/')
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
        map_data=json.dumps(data['map_data'].__dict__),
        user_id=user.id
    )
    db.session.add(map_)
    db.session.commit()
    return map_.to_dict()
