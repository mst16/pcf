var MST16 = window.MST16 || {};
MST16.Email = MST16.Email || {};

MST16.Email.openEmailDialog = function (emailAddress) {
    Xrm.Navigation.navigateTo(
        {
            pageType: "entityrecord",
            entityName: "email",
            createFromEntity: Xrm.Page.data.entity.getEntityReference()
        },
        {
            target: 2,
            position: 1,
            width: {
                value: 90,
                unit: "%"
            }
        }
    ).then((params) => {
        if (params && params.savedEntityReference) {
            // Unsupported API
            Xrm.Page.ui.refresh();

            // Supported API, but doesn't work as expected
            //Xrm.Page.data.refresh(true).then(() => { Xrm.Page.ui.refreshRibbon(); });
        }
    });
}