from flask import Blueprint, jsonify, request
from flask_login import login_required

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


@user_routes.route('/<int:id>', methods=['PUT'])
@login_required
def edit_user(id):

    url = ''
    user = User.query.get(id)

    if "image" not in request.files:
        return {'errors': 'image required'}, 400

    image = request.files["image"]

    if image:
        if not allowed_file(image.filename):
            return {"errors": "file type not permitted"}, 400

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

    form = EditForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        data = form.data
        username = data['username']
        email = data['email']

        user.username = username
        user.email = email
        db.session.commit()
        return user.to_dict()

    return user.to_dict()
