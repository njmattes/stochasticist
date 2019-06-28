#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import Flask, render_template
from flask_assets import Environment, Bundle
from flask_misaka import Misaka
from stochasticist.views import main_views


app = Flask(__name__)
app.config.from_object('stochasticist.config.FlaskConfig')
app.register_blueprint(main_views)

markdown = Misaka(app, disable_indented_code=True, smartypants=True)

assets = Environment(app)

assets.register('css_main',
                Bundle('sass/main.css',
                       filters='cssmin', output='gen/main.css'))
assets.register('img_favicon',
                Bundle('images/favicon-128-001.png', output='gen/favicon.png'))


# @app.errorhandler(400)
# def not_found(error):
#     return render_template(
#         'errors/400_500.html', error_code=400,
#         error_msg='Your client seems to be speaking a bunch of bollocks.'), 403
#
#
# @app.errorhandler(401)
# def not_found(error):
#     return render_template(
#         'errors/400_500.html', error_code=401,
#         error_msg='You *do* in fact need stinking badges for that.'), 403
#
#
@app.errorhandler(403)
def not_found(error):
    return render_template(
        'errors/400_500.html', error_code=403,
        error_msg='Access to this is forbidden. For you anyway.'), 403
#
#
# @app.errorhandler(404)
# def not_found(error):
#     return render_template(
#         'errors/400_500.html', error_code=404,
#         error_msg='Some things change. Link rot remains.'), 404
#
#
# @app.errorhandler(500)
# def not_found(error):
#     return render_template(
#         'errors/400_500.html', error_code=500,
#         error_msg='The server has soiled it\'s diaper. '
#                   'Maintenance is required.'), 500
