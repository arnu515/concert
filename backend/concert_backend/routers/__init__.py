from sanic import Blueprint

from .auth import router as auth_router
from .invites import router as invites_router
from .stages import router as stages_router
from .stage import router as stage_router

routers: tuple[Blueprint] = (auth_router, stages_router, invites_router, stage_router)
