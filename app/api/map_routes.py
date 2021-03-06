import json

from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from sqlalchemy import not_

from app.models import Map, db, User


map_routes = Blueprint('maps', __name__)


def isInt(value):
    try:
        int(value)
        value = int(value)
        return True
    except ValueError:
        value = value
        return False


@map_routes.route('/page/<int:index>')
@login_required
def maps(index):
    limit_ = 15
    offset_ = 15 * (index - 1)
    user_maps = User.query.get(current_user.id).map.all()
    map_ids = [i.id for i in user_maps]
    maps = db.session.query(Map).filter(not_(Map.id.in_(map_ids))). \
        order_by(Map.id.desc()).offset(offset_).limit(limit_).all()
    return {'maps': {maps[i].id: maps[i].to_dict() for i in range(len(maps))}}


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
    exists = Map.query.filter(Map.name == data['name']).first()
    if exists:
        return {'errors': ['Name is already taken']}, 400

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


@map_routes.route('/<value>', methods=['GET', 'DELETE', 'PUT'])
@login_required
def get_map(value):
    if isInt(value):
        if request.method == 'GET':
            map_ = Map.query.filter(Map.id == value).all()
        else:
            map_ = Map.query.filter(Map.id == value).first()
    else:
        if request.method == 'GET':
            substring = "%{}%".format(value)
            map_ = Map.query.filter(Map.name.ilike(substring)).all()
        else:
            map_ = Map.query.filter(Map.name == value).first()
    if map_:
        if request.method == 'DELETE':
            db.session.delete(map_)
            db.session.commit()
            id_ = map_.id
            if id_:
                return {"id": id_}
            return {'errors': ['map does not exist']}, 400
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
            map_.map_image = data['map_image']
            db.session.commit()
            return map_.to_dict()
        else:
            return {'maps': {map_[i].id: map_[i].to_dict()
                    for i in range(len(map_))}}
    return {'errors': [f'No maps found with: {value}']}, 400


@map_routes.route('/load/<value>', methods=['GET'])
@login_required
def load_map(value):
    if isInt(value):
        map_ = Map.query.filter(Map.id == value).first()
    else:
        map_ = Map.query.filter(Map.name == value).first()
    if map_:
        return map_.to_dict()
    return {'errors': ['map does not exist']}, 400
