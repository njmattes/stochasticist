#!/usr/bin/env python
# -*- coding: utf-8 -*-


class FlaskConfig(object):
    DEBUG = True
    ASSETS_DEBUG = True

    CACHE_TYPE = 'redis'
    CACHE_KEY_PREFIX = 'stochasticist'

    ADMINS = frozenset(['matteson@obstructures.org'])
    SECRET_KEY = 'REPLACEME'

    THREADS_PER_PAGE = 8
