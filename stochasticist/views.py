#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import Blueprint, render_template, make_response, abort
from stochasticist.constants import DEFAULTS


main_views = Blueprint('base_views', __name__, static_folder='static')


@main_views.route('/')
def index():
    return render_template(
        'index.html',
        size=10,
        stroke=2,
    )


@main_views.route('/about')
def about():
    return render_template(
        'about.html',
    )


@main_views.route('/<path:path>')
def dynamic_index(path):
    path = path.strip('/')
    arr = path.split('/')
    print(arr)
    if len(arr) % 2 != 0:
        abort(403)
    kwargs = {arr[i*2]: arr[i*2+1] for i in range(len(arr)//2)}
    for k in DEFAULTS:
        if k not in kwargs.keys():
            kwargs[k] = DEFAULTS[k]
    return render_template(
        'index.html',
        **kwargs
    )
