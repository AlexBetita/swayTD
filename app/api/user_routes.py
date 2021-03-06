from dateutil import parser

from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user

from app.forms import EditForm
from app.models import User, db
from app.helpers import (
    upload_file_to_s3, allowed_file, get_unique_filename)

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    users = User.query.all()
    return {"users": [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    user = User.query.get(id)
    return user.to_dict()

#https://hackmd.io/@jpshafto/SyWY45KGu
@user_routes.route('/<int:id>', methods=['PUT'])
@login_required
def edit_user(id):
    user = User.query.get(id)

    url = ''
    password = ''
    try:
        password = request.form['password']
    except KeyError:
        password = ''
    username = request.form['username']
    email = request.form['email']
    date = parser.parse(request.form['updated_at'], fuzzy=True)

    if User.query.filter(User.username == username).first() \
            and user.username != username:
        return {'errors': ['Username is already taken']}
    elif User.query.filter(User.email == email).first() \
            and user.email != email:
        return {'errors': ['Email is already registered']}

    if request.method == 'PUT':
        if "image" not in request.files:
            profileImage = request.form['image']

            if(profileImage != user.profileImage):
                return {'errors': ['Not a valid file']}, 400

            user.username = username
            user.email = email
            user.updated_at = date
            if password:
                user.password = password
            db.session.commit()
            return user.to_dict()

        image = request.files["image"]

        if image:
            if not allowed_file(image.filename):
                return {"errors": ["file type not permitted"]}, 400

            image.filename = get_unique_filename(image.filename)

            upload = upload_file_to_s3(image)

            if "url" not in upload:
                # if the dictionary doesn't have a url key
                # it means that there was an error when we tried to upload
                # so we send back that error message
                return upload, 400

            url = upload["url"]

        else:
            url = user.profileImage

        user.username = username
        user.email = email
        user.profileImage = url
        user.updated_at = date
        if password:
            user.password = password
        db.session.commit()
        return user.to_dict()

    return {'errors': ['Broken']}, 400


@user_routes.route('/maps/<int:index>')
@login_required
def user_map_by_index(index):
    user = User.query.get(current_user.id)
    return user.to_dict_maps(index)
