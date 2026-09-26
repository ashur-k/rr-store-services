from django.urls import path

from .views import OIDCBackchannelLogoutView
from .views.admin_user_list import AdminUserListView
from .views.health import HealthView
from .views.item_list import ItemListView
from .views.protected_report import protected_report
from .views.user_profile import UserProfileView

urlpatterns = [
    path("health/", HealthView.as_view(), name="health"),
    path("me/", UserProfileView.as_view(), name="user-profile"),
    path("items/", ItemListView.as_view(), name="item-list"),
    path("admin/users/", AdminUserListView.as_view(), name="admin-users"),
    path("reports/", protected_report, name="protected-report"),
    path("oidc/backchannel-logout/", OIDCBackchannelLogoutView.as_view(), name="oidc-backchannel-logout"),
]