using Microsoft.Extensions.Configuration;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Notifications;

namespace Umbraco.Headless.Demo.Composing
{
    public class ApplicationComposer : IComposer
    {

        public void Compose(IUmbracoBuilder builder)
        {
            builder.AddNotificationHandler<ContentSavingNotification, ApplicationNotificationHandler>();
            builder.AddNotificationHandler<ContentDeletingNotification, ApplicationNotificationHandler>();
            builder.AddNotificationHandler<MediaSavingNotification, ApplicationNotificationHandler>();
            builder.AddNotificationHandler<MediaDeletingNotification, ApplicationNotificationHandler>();
            builder.AddNotificationHandler<UserSavingNotification, ApplicationNotificationHandler>();
            builder.AddNotificationHandler<UserDeletingNotification, ApplicationNotificationHandler>();
            builder.AddNotificationHandler<ContentTypeSavingNotification, ApplicationNotificationHandler>();
            builder.AddNotificationHandler<ContentTypeDeletingNotification, ApplicationNotificationHandler>();
            builder.AddNotificationHandler<MediaTypeSavingNotification, ApplicationNotificationHandler>();
            builder.AddNotificationHandler<MediaTypeDeletingNotification, ApplicationNotificationHandler>();
            builder.AddNotificationHandler<MemberTypeSavingNotification, ApplicationNotificationHandler>();
            builder.AddNotificationHandler<MemberTypeDeletingNotification, ApplicationNotificationHandler>();
            builder.AddNotificationHandler<DataTypeSavingNotification, ApplicationNotificationHandler>();
            builder.AddNotificationHandler<DataTypeDeletingNotification, ApplicationNotificationHandler>();
            builder.AddNotificationHandler<TemplateSavingNotification, ApplicationNotificationHandler>();
            builder.AddNotificationHandler<TemplateDeletingNotification, ApplicationNotificationHandler>();
            builder.AddNotificationHandler<PartialViewCreatingNotification, ApplicationNotificationHandler>();
            builder.AddNotificationHandler<PartialViewSavingNotification, ApplicationNotificationHandler>();
            builder.AddNotificationHandler<PartialViewDeletingNotification, ApplicationNotificationHandler>();
        }

        private class ApplicationNotificationHandler :
            INotificationHandler<ContentSavingNotification>,
            INotificationHandler<ContentDeletingNotification>,
            INotificationHandler<MediaSavingNotification>,
            INotificationHandler<MediaDeletingNotification>,
            INotificationHandler<UserSavingNotification>,
            INotificationHandler<UserDeletingNotification>,
            INotificationHandler<ContentTypeSavingNotification>,
            INotificationHandler<ContentTypeDeletingNotification>,
            INotificationHandler<MediaTypeSavingNotification>,
            INotificationHandler<MediaTypeDeletingNotification>,
            INotificationHandler<MemberTypeSavingNotification>,
            INotificationHandler<MemberTypeDeletingNotification>,
            INotificationHandler<DataTypeSavingNotification>,
            INotificationHandler<DataTypeDeletingNotification>,
            INotificationHandler<TemplateSavingNotification>,
            INotificationHandler<TemplateDeletingNotification>,
            INotificationHandler<PartialViewCreatingNotification>,
            INotificationHandler<PartialViewSavingNotification>,
            INotificationHandler<PartialViewDeletingNotification>
        {
            private readonly EventMessage _cancelEventMessage = new EventMessage(
                "This operation has been cancelled",
                "Changes are not permitted in this demo",
                EventMessageType.Error);


            private readonly IConfiguration _configuration;

            public ApplicationNotificationHandler(IConfiguration config)
            {
                _configuration = config;
            }

            public void Handle(ContentSavingNotification notification) => DoHandle(notification);
            public void Handle(ContentDeletingNotification notification) => DoHandle(notification);
            public void Handle(MediaSavingNotification notification) => DoHandle(notification);
            public void Handle(MediaDeletingNotification notification) => DoHandle(notification);
            public void Handle(UserSavingNotification notification)
            {
                // We need to allow setting of last login dates etc, but we'll block 
                // anything else
                var readonlyUserProperties = new[]{
                    "Name",
                    "Username",
                    "Email",
                    "Avatar",
                    "RawPasswordValue",
                    "PasswordConfiguration",
                    "StartContentIds",
                    "StartMediaIds",
                    "Language",
                    "Language",
                    "Groups"
                };

                if (notification.SavedEntities.Any(x => readonlyUserProperties.Any(y => x.IsPropertyDirty(y))))
                {
                    DoHandle(notification);
                }
            }
            public void Handle(UserDeletingNotification notification) => DoHandle(notification);
            public void Handle(ContentTypeSavingNotification notification) => DoHandle(notification);
            public void Handle(ContentTypeDeletingNotification notification) => DoHandle(notification);
            public void Handle(MediaTypeSavingNotification notification) => DoHandle(notification);
            public void Handle(MediaTypeDeletingNotification notification) => DoHandle(notification);
            public void Handle(MemberTypeSavingNotification notification) => DoHandle(notification);
            public void Handle(MemberTypeDeletingNotification notification) => DoHandle(notification);
            public void Handle(DataTypeSavingNotification notification) => DoHandle(notification);
            public void Handle(DataTypeDeletingNotification notification) => DoHandle(notification);
            public void Handle(TemplateSavingNotification notification) => DoHandle(notification);
            public void Handle(TemplateDeletingNotification notification) => DoHandle(notification);
            public void Handle(PartialViewCreatingNotification notification) => DoHandle(notification);
            public void Handle(PartialViewSavingNotification notification) => DoHandle(notification);
            public void Handle(PartialViewDeletingNotification notification) => DoHandle(notification);

            private void DoHandle<T>(CancelableObjectNotification<T> notification)
                where T : class
            {
                if (_configuration["Site:DisableEdits"]?.ToString().ToLower() == "true")
                {
                    notification.CancelOperation(_cancelEventMessage);
                }
            }
        }
    }
}
