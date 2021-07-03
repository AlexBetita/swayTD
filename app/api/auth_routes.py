from flask import Blueprint, jsonify, session, request
from flask_login import current_user, login_user, logout_user, login_required

from app.models import User, db
from app.forms import LoginForm
from app.forms import SignUpForm
from app.helpers import (
    upload_file_to_s3, allowed_file, get_unique_filename)

auth_routes = Blueprint('auth', __name__)


def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f"{field} : {error}")
    return errorMessages


@auth_routes.route('/')
def authenticate():
    """
    Authenticates a user.
    """
    if current_user.is_authenticated:
        return current_user.to_dict()
    return {'errors': ['Unauthorized']}


@auth_routes.route('/login', methods=['POST'])
def login():
    """
    Logs a user in
    """
    form = LoginForm()
    print(request.get_json())
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # Add the user to the session, we are logged in!
        user = User.query.filter(
            User.email == form.data['email']).first()

        login_user(user)
        return user.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@auth_routes.route('/login/demo', methods=['POST'])
def demo():
    """
    Logs a user in
    """
    user = User.query.filter(User.id == 1).first()
    login_user(user)
    return user.to_dict()


@auth_routes.route('/logout')
def logout():
    """
    Logs a user out
    """
    logout_user()
    return {'message': 'User logged out'}


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """
    Creates a new user and logs them in
    """
    print(1)
    if "image" not in request.files:
        print(2)
        return {'errors': ['image required']}, 400

    print(3)
    image = request.files["image"]

    print(4)
    if not allowed_file(image.filename):
        return {"errors": ["file type not permitted"]}, 400

    print(5)
    image.filename = get_unique_filename(image.filename)

    print(6)
    upload = upload_file_to_s3(image)

    print(7)
    if "url" not in upload:
        # if the dictionary doesn't have a url key
        # it means that there was an error when we tried to upload
        # so we send back that error message
        print(9)
        return upload, 400

    print(8)

    url = upload["url"]

    form = SignUpForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        user = User(
            username=form.data['username'],
            email=form.data['email'],
            password=form.data['password'],
            profileImage=url
        )
        db.session.add(user)
        db.session.commit()
        login_user(user)
        return user.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {'errors': ['Unauthorized']}, 401
