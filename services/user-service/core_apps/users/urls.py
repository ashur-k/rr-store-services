from django.urls import path

from .views import (
    AdminUserListView,
    HealthView,
    ItemListView,
    OIDCBackchannelLogoutView,
    StoreUserDetailView,
    StoreUserListCreateView,
    UserDetailView,
    UserListCreateView,
    UserProfileView,
    protected_report,
)

urlpatterns = [
    path("", UserListCreateView.as_view(), name="user-list-create"),
    path("<int:user_id>/", UserDetailView.as_view(), name="user-detail"),
    path("health/", HealthView.as_view(), name="health"),
    path("me/", UserProfileView.as_view(), name="user-profile"),
    path("items/", ItemListView.as_view(), name="item-list"),
    path("admin/users/", AdminUserListView.as_view(), name="admin-users"),
    path("store-users/", StoreUserListCreateView.as_view(), name="store-users-list-create"),
    path("store-user/<int:user_id>/", StoreUserDetailView.as_view(), name="store-user-detail"),
    path("reports/", protected_report, name="protected-report"),
    path("oidc/backchannel-logout/", OIDCBackchannelLogoutView.as_view(), name="oidc-backchannel-logout"),
]
