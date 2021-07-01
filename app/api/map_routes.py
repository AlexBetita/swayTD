from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import Map


map_routes = Blueprint('maps', __name__)
