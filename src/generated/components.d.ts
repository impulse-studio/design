export type DigiComponentName =
  | "DigiAccordion"
  | "DigiAccordionCardItem"
  | "DigiAccordionContent"
  | "DigiAccordionItem"
  | "DigiAccordionTrigger"
  | "DigiAlert"
  | "DigiAvatar"
  | "DigiBackButton"
  | "DigiBadge"
  | "DigiBaseCard"
  | "DigiBaseModal"
  | "DigiBasicDropdownItem"
  | "DigiBasicDropdownMenu"
  | "DigiButton"
  | "DigiCardCollapsible"
  | "DigiCardLayout1"
  | "DigiCardListPageLayout"
  | "DigiCardTitle"
  | "DigiCheckbox"
  | "DigiCheckboxFormField"
  | "DigiClipboard"
  | "DigiCollapsible"
  | "DigiCollapsibleContent"
  | "DigiCollapsibleTrigger"
  | "DigiColorPickerFormField"
  | "DigiComponentConfigProvider"
  | "DigiConfirmDeletionModal"
  | "DigiConfirmInputModal"
  | "DigiConfirmModal"
  | "DigiCopyIconButton"
  | "DigiCustomSearchSelect"
  | "DigiDashboardCard"
  | "DigiDashboardCardRow"
  | "DigiDashboardCardSection"
  | "DigiDatePickerFormField"
  | "DigiDateTimePickerFormField"
  | "DigiDescription"
  | "DigiDropdownMenuItem"
  | "DigiDropdownMenuLabel"
  | "DigiDropdownMenuSeparator"
  | "DigiEmailFormField"
  | "DigiFileFormField"
  | "DigiFileInput"
  | "DigiFontSearchSelect"
  | "DigiFontSearchSelectFormField"
  | "DigiForm"
  | "DigiFormCard"
  | "DigiFormField"
  | "DigiFormFieldContextRenderer"
  | "DigiFormModal"
  | "DigiFormSheet"
  | "DigiGettingStartedChecklist"
  | "DigiGroupCard"
  | "DigiGroupClickableCard"
  | "DigiGroupDraggableCard"
  | "DigiIconButton"
  | "DigiIconLink"
  | "DigiIconRouterLink"
  | "DigiIconSidebar"
  | "DigiIconSidebarButton"
  | "DigiIconSidebarLink"
  | "DigiIconSidebarWithPanel"
  | "DigiIframe"
  | "DigiInformationCard"
  | "DigiIntroPageLayout"
  | "DigiItemsSelectionPreview"
  | "DigiLabel"
  | "DigiLink"
  | "DigiLinkDropdownItem"
  | "DigiMessageModal"
  | "DigiModal"
  | "DigiModalContent"
  | "DigiModalFooter"
  | "DigiModalFormField"
  | "DigiModalHeader"
  | "DigiModalScrollArea"
  | "DigiMultiStepModal"
  | "DigiMultiStepModalFormStep"
  | "DigiMultiStepModalInfoStep"
  | "DigiNudeBadge"
  | "DigiNudeForm"
  | "DigiNudeFormField"
  | "DigiNudeModal"
  | "DigiNumberFormField"
  | "DigiNumberInput"
  | "DigiOptionalDateTimePickerFormField"
  | "DigiOptionalFormField"
  | "DigiOptionalNumberFormField"
  | "DigiOptionalSearchSelectFormField"
  | "DigiOptionalTextFormField"
  | "DigiOverlay"
  | "DigiPageHeader"
  | "DigiPageTabItem"
  | "DigiPagination"
  | "DigiPasswordFormField"
  | "DigiPhoneFormField"
  | "DigiPlaceholderRowCard"
  | "DigiPopover"
  | "DigiPopoverContent"
  | "DigiPopoverTrigger"
  | "DigiRadioFormField"
  | "DigiRadioGroup"
  | "DigiRadioGroupCardItem"
  | "DigiRadioGroupFormField"
  | "DigiRadioGroupItem"
  | "DigiRadioGroupNudeItem"
  | "DigiRemixIcon"
  | "DigiRemovableChip"
  | "DigiRouterLink"
  | "DigiRowCard"
  | "DigiRowClickableCard"
  | "DigiRowDraggableCard"
  | "DigiSearchField"
  | "DigiSearchSelect"
  | "DigiSearchSelectFormField"
  | "DigiSettingsCard"
  | "DigiSettingsPageLayout"
  | "DigiSettingsRowLayout"
  | "DigiSheet"
  | "DigiSidePanel"
  | "DigiSidePanelContent"
  | "DigiSidePanelHeader"
  | "DigiSingleSettingRow"
  | "DigiSortable"
  | "DigiSortableElementPicker"
  | "DigiSortableHandle"
  | "DigiSpinner"
  | "DigiStarsRenderer"
  | "DigiStepper"
  | "DigiSwitch"
  | "DigiSwitchFormField"
  | "DigiSwitchSingleSettings"
  | "DigiTabContent"
  | "DigiTable"
  | "DigiTableBody"
  | "DigiTableCell"
  | "DigiTableEmpty"
  | "DigiTableEmptyRow"
  | "DigiTableFooter"
  | "DigiTableHead"
  | "DigiTableHeader"
  | "DigiTablePageLayout"
  | "DigiTableRow"
  | "DigiTabsContainer"
  | "DigiTabsPageLayout"
  | "DigiTextFormField"
  | "DigiTextInput"
  | "DigiTextPlaceholder"
  | "DigiTextPlaceholderWrapper"
  | "DigiTextTooltip"
  | "DigiTextarea"
  | "DigiTextareaFormField"
  | "DigiTimePickerFormField"
  | "DigiTimeRangePickerFormField"
  | "DigiTitle"
  | "DigiToast"
  | "DigiToggle"
  | "DigiToggleGroup"
  | "DigiToggleGroupFormField"
  | "DigiToggleGroupItem"
  | "DigiToggleableFormCard"
  | "DigiTooltipIcon"
  | "DigiTooltipProvider"
  | "DigiTutorialLink"
  | "DigiUrlFormField"
  | "DigiUrlInput"
  | "DigiVerticalMenu"
  | "DigiVerticalMenuSub"
  | "DigiVerticalMenuSubForm"
  | "DigiVerticalMenuTab"

export type DigiComponentProps = {
  "DigiAccordion": {
    "collapsible"?: false | true
    "modelValue"?: any
    "disabled"?: false | true
    "type"?: "single" | "multiple"
    "defaultValue"?: any
  }
  "DigiAccordionCardItem": {
    "itemKey": string
    "size"?: null | "sm" | "md"
  }
  "DigiAccordionContent": {
    "class"?: any
    "renderDomWhenCollapsed"?: false | true
  }
  "DigiAccordionItem": {
    "disabled"?: false | true
    "value": string
    "class"?: any
  }
  "DigiAccordionTrigger": {
    "iconName"?: string
    "class"?: any
  }
  "DigiAlert": {
    "title": string
    "description"?: string
    "action"?: unknown
    "variant": null | "info" | "destructive" | "warning"
    "isLoading"?: false | true
    "class"?: any
  }
  "DigiAvatar": {
    "src"?: string
    "text"?: string
  }
  "DigiBackButton": {
    "to"?: unknown
    "text": string
  }
  "DigiBadge": {
    "color"?: null | "nearWhite" | "nearBlack" | "green" | "red" | "blue" | "purple" | "yellow"
    "class"?: any
    "text"?: string
    "iconName"?: string
  }
  "DigiBaseCard": {
  }
  "DigiBaseModal": {
    "scrollable"?: false | true
    "size"?: "sm" | "md" | "lg"
    "hideCloseButton"?: false | true
  }
  "DigiBasicDropdownItem": {
  }
  "DigiBasicDropdownMenu": {
  }
  "DigiButton": {
    "variant"?: null | "destructive" | "primary" | "success" | "secondary" | "ghost" | "link"
    "size"?: null | "sm" | "md" | "lg" | "icon"
    "class"?: any
    "type"?: "button" | "submit"
    "block"?: false | true
    "iconName"?: string
    "disabled"?: false | true
    "formId"?: string
    "isLoading"?: unknown
    "id"?: string
  }
  "DigiCardCollapsible": {
  }
  "DigiCardLayout1": {
    "title": string
    "description"?: string
    "helpLink"?: string
    "iconName"?: string
  }
  "DigiCardListPageLayout": {
    "title"?: string
    "feature"?: any
    "parentRoute"?: unknown
    "parentRouteText"?: string
    "createCta"?: string
    "fullWidth"?: false | true
    "fullWidthHeader"?: false | true
    "class"?: any
  }
  "DigiCardTitle": {
    "class"?: any
    "iconName"?: string
  }
  "DigiCheckbox": {
    "disabled"?: false | true
    "class"?: any
    "id"?: string
  }
  "DigiCheckboxFormField": {
    "disabled"?: false | true
    "name": string
    "indications"?: string
    "label": string
    "description"?: string
    "placeholder"?: string
    "required"?: false | true
    "context"?: "modal" | "card" | "nude"
  }
  "DigiClipboard": {
    "textToCopy": string
    "fullWidth"?: false | true
  }
  "DigiCollapsible": {
    "disabled"?: false | true
    "open"?: false | true
    "defaultOpen"?: false | true
  }
  "DigiCollapsibleContent": {
    "forceMount"?: false | true
  }
  "DigiCollapsibleTrigger": {
  }
  "DigiColorPickerFormField": {
    "name": string
    "zodSchema"?: unknown
    "indications"?: string
    "label": string
    "description"?: string
    "placeholder"?: string
    "disabled"?: false | true
    "required"?: false | true
    "context"?: "modal" | "card" | "nude"
    "iconName"?: string
  }
  "DigiComponentConfigProvider": {
    "config": unknown
  }
  "DigiConfirmDeletionModal": {
    "confirmBody"?: string
    "action": unknown
  }
  "DigiConfirmInputModal": {
    "title": string
    "confirmationPhrase": string
    "confirmBody"?: string
    "confirmCta"?: string
    "cancelCta"?: string
    "cancelDisabled"?: false | true
    "disabled"?: false | true
    "action": unknown
  }
  "DigiConfirmModal": {
    "variant"?: "destructive" | "primary" | "success"
    "title": string
    "confirmBody"?: string
    "confirmCta"?: string
    "confirmIconName"?: string
    "cancelCta"?: string
    "action": unknown
  }
  "DigiCopyIconButton": {
    "textToCopy": string
  }
  "DigiCustomSearchSelect": {
    "searchPlaceholder"?: string
    "searchFormatter"?: unknown
    "emptySearchText"?: string
    "getOptions": unknown
    "debounce"?: number
    "deactivateRowClick"?: false | true
    "suggestions"?: unknown
  }
  "DigiDashboardCard": {
    "title": string
    "iconName"?: string
    "draggable"?: false | true
    "padding"?: false | true
    "actionsVisible"?: false | true
  }
  "DigiDashboardCardRow": {
    "name": string
    "description"?: string
    "iconName"?: string
    "tooltip"?: string
    "to"?: unknown
  }
  "DigiDashboardCardSection": {
    "sectionTitle": string
    "iconName"?: string
  }
  "DigiDatePickerFormField": {
    "name": string
    "zodSchema"?: unknown
    "indications"?: string
    "label": string
    "description"?: string
    "placeholder"?: string
    "disabled"?: false | true
    "required"?: false | true
    "context"?: "modal" | "card" | "nude"
    "min"?: unknown
    "max"?: unknown
    "timezone"?: string
  }
  "DigiDateTimePickerFormField": {
  }
  "DigiDescription": {
    "description": string
  }
  "DigiDropdownMenuItem": {
  }
  "DigiDropdownMenuLabel": {
  }
  "DigiDropdownMenuSeparator": {
  }
  "DigiEmailFormField": {
    "name": string
    "zodSchema"?: unknown
    "indications"?: string
    "label": string
    "description"?: string
    "placeholder"?: string
    "disabled"?: false | true
    "required"?: false | true
    "context"?: "modal" | "card" | "nude"
    "iconName"?: string
  }
  "DigiFileFormField": {
    "name": string
    "zodSchema"?: unknown
    "indications"?: string
    "label": string
    "description"?: string
    "placeholder"?: string
    "disabled"?: false | true
    "required"?: false | true
    "context"?: "modal" | "card" | "nude"
    "acceptedFileTypes"?: string
    "maxSizeInMb"?: number
  }
  "DigiFileInput": {
    "disabled"?: false | true
    "onChange"?: unknown
    "name"?: string
    "state"?: unknown
    "iconName"?: string
    "min"?: string | number
    "max"?: string | number
    "step"?: number
    "accept"?: string
    "autocomplete"?: string
    "acceptedFileTypes"?: string
  }
  "DigiFontSearchSelect": {
    "multiple"?: false | true
    "valuePlaceholder"?: string
    "state"?: unknown
    "selectedText"?: string
  }
  "DigiFontSearchSelectFormField": {
    "name": string
    "zodSchema"?: unknown
    "indications"?: string
    "label": string
    "description"?: string
    "placeholder"?: string
    "disabled"?: false | true
    "required"?: false | true
    "context"?: "modal" | "card" | "nude"
    "selectProps"?: unknown
  }
  "DigiForm": {
  }
  "DigiFormCard": {
    "title": string
    "description"?: string
    "helpLink"?: string
    "isLoading"?: false | true
    "disabled"?: false | true
    "hasModifications": false | true
    "resetCta"?: string
    "saveCta"?: string
    "smallSpacing"?: false | true
    "hideResetCta"?: false | true
  }
  "DigiFormField": {
    "name": string
    "zodSchema"?: unknown
    "indications"?: string
    "label": string
    "description"?: string
    "placeholder"?: string
    "disabled"?: false | true
    "required"?: false | true
    "context"?: "modal" | "card" | "nude"
  }
  "DigiFormFieldContextRenderer": {
    "name": string
    "zodSchema"?: unknown
    "indications"?: string
    "label": string
    "description"?: string
    "placeholder"?: string
    "disabled"?: false | true
    "required"?: false | true
    "context"?: "modal" | "card" | "nude"
  }
  "DigiFormModal": {
    "title": string
    "description"?: string
    "cancelCta"?: string
    "submitCta"?: string
    "submitCtaVariant"?: null | "destructive" | "primary" | "success" | "secondary" | "ghost" | "link"
    "submitCtaIconName"?: string
    "isLoading"?: false | true
    "hideCancelButton"?: false | true
    "disabled"?: false | true
    "scrollable"?: false | true
    "size"?: "sm" | "md" | "lg"
    "hideCloseButton"?: false | true
  }
  "DigiFormSheet": {
    "title": string
    "description"?: string
    "cancelCta"?: string
    "submitCta"?: string
    "isLoading"?: false | true
    "disabled"?: false | true
  }
  "DigiGettingStartedChecklist": {
    "title": string
    "tasks": unknown
    "description"?: string
    "class"?: any
  }
  "DigiGroupCard": {
    "disabled"?: false | true
  }
  "DigiGroupClickableCard": {
    "disabled"?: false | true
    "name": unknown
  }
  "DigiGroupDraggableCard": {
    "disabled"?: false | true
    "name": string
    "enableDrag"?: false | true
    "size"?: null | "sm" | "md"
    "editable"?: false | true
  }
  "DigiIconButton": {
    "iconName": string
    "size"?: null | "sm" | "md" | "lg"
    "variant"?: null | "destructive" | "primary" | "link"
    "tooltipSide"?: "top" | "right" | "bottom" | "left"
    "disabled"?: false | true
    "tooltip": any
    "class"?: any
    "iconClass"?: any
    "isLoading"?: false | true
  }
  "DigiIconLink": {
    "href": string
    "iconName": string
    "size"?: null | "sm" | "md" | "lg"
    "variant"?: "primary" | "link"
    "tooltipSide"?: "top" | "right" | "bottom" | "left"
    "disabled"?: false | true
    "tooltip": string
  }
  "DigiIconRouterLink": {
    "to": unknown
    "variant"?: "primary" | "link"
    "size"?: null | "sm" | "md" | "lg"
    "newTab"?: false | true
    "disabled"?: false | true
    "iconName": string
    "tooltip": string
    "tooltipSide"?: "top" | "right" | "bottom" | "left"
  }
  "DigiIconSidebar": {
  }
  "DigiIconSidebarButton": {
    "label": string
    "iconName": string
    "selected"?: false | true
    "disabled"?: false | true
  }
  "DigiIconSidebarLink": {
    "label": string
    "iconName": string
    "selected"?: false | true
    "disabled"?: false | true
    "to": unknown
  }
  "DigiIconSidebarWithPanel": {
    "isPanelOpen": false | true
  }
  "DigiIframe": {
    "iframeUrl": string
    "width"?: string
    "aspectRatio"?: string
    "scrollable"?: false | true
    "referrerPolicy"?: "no-referrer" | "no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "same-origin" | "strict-origin" | "strict-origin-when-cross-origin" | "unsafe-url"
  }
  "DigiInformationCard": {
    "size"?: null | "sm" | "md" | "lg"
    "class"?: any
  }
  "DigiIntroPageLayout": {
    "title": string
    "description"?: string
    "helpLink"?: string
    "iconName": string
  }
  "DigiItemsSelectionPreview": {
    "items": unknown
    "max"?: number
    "canAdd"?: false | true
    "buttonTop"?: false | true
    "itemLabel": string
  }
  "DigiLabel": {
    "class"?: any
    "for"?: string
  }
  "DigiLink": {
    "href": string
    "variant"?: "destructive" | "primary" | "secondary" | "ghost" | "link"
    "size"?: "sm" | "md" | "lg" | "icon"
    "disabled"?: false | true
    "iconName"?: string
    "class"?: any
  }
  "DigiLinkDropdownItem": {
  }
  "DigiMessageModal": {
  }
  "DigiModal": {
    "open"?: false | true
    "defaultOpen"?: false | true
    "modal"?: false | true
  }
  "DigiModalContent": {
    "forceMount"?: false | true
    "asChild"?: false | true
    "as"?: unknown
    "disableOutsidePointerEvents"?: false | true
    "class"?: any
    "scrollable"?: false | true
    "size"?: "sm" | "md" | "lg"
    "hideCloseButton"?: false | true
  }
  "DigiModalFooter": {
    "class"?: any
  }
  "DigiModalFormField": {
    "name": string
    "zodSchema"?: unknown
    "indications"?: string
    "label": string
    "description"?: string
    "placeholder"?: string
    "disabled"?: false | true
    "required"?: false | true
    "context"?: "modal" | "card" | "nude"
  }
  "DigiModalHeader": {
    "class"?: any
  }
  "DigiModalScrollArea": {
    "class"?: any
  }
  "DigiMultiStepModal": {
    "title": string
    "description"?: string
    "size"?: "sm" | "md" | "lg"
    "builder": unknown
    "input": unknown
  }
  "DigiMultiStepModalFormStep": {
    "submitCta"?: string
    "submitCtaVariant"?: null | "destructive" | "primary" | "success" | "secondary" | "ghost" | "link"
    "submitCtaIconName"?: string
    "cancelCta"?: string
    "isLoading"?: false | true
    "disabled"?: false | true
    "hideCancelButton"?: false | true
  }
  "DigiMultiStepModalInfoStep": {
    "submitCta"?: string
    "submitCtaVariant"?: null | "destructive" | "primary" | "success" | "secondary" | "ghost" | "link"
    "submitCtaIconName"?: string
    "cancelCta"?: string
    "hideCancelButton"?: false | true
    "next": unknown
    "back": unknown
  }
  "DigiNudeBadge": {
    "color"?: null | "nearWhite" | "nearBlack" | "green" | "red" | "blue" | "purple" | "yellow"
    "class"?: any
  }
  "DigiNudeForm": {
    "context"?: "modal" | "card" | "nude"
    "id"?: string
  }
  "DigiNudeFormField": {
  }
  "DigiNudeModal": {
    "title": string
    "description"?: string
    "size"?: "sm" | "md" | "lg"
    "scrollable"?: false | true
  }
  "DigiNumberFormField": {
    "name": string
    "zodSchema"?: unknown
    "indications"?: string
    "label": string
    "description"?: string
    "placeholder"?: string
    "disabled"?: false | true
    "required"?: false | true
    "context"?: "modal" | "card" | "nude"
    "iconName"?: string
    "formatter"?: unknown
    "step"?: number
    "min"?: number
    "max"?: number
    "enforceBounds"?: false | true
  }
  "DigiNumberInput": {
    "name"?: string
    "placeholder"?: string
    "disabled"?: false | true
    "state"?: unknown
    "iconName"?: string
    "min"?: string | number
    "max"?: string | number
    "step"?: number
    "accept"?: string
    "onChange"?: unknown
    "autocomplete"?: string
    "formatter"?: unknown
    "enforceBounds"?: false | true
  }
  "DigiOptionalDateTimePickerFormField": {
  }
  "DigiOptionalFormField": {
    "name": string
    "zodSchema"?: unknown
    "indications"?: string
    "label": string
    "description"?: string
    "placeholder"?: string
    "disabled"?: false | true
    "required"?: false | true
    "context"?: "modal" | "card" | "nude"
  }
  "DigiOptionalNumberFormField": {
    "name": string
    "zodSchema"?: unknown
    "indications"?: string
    "label": string
    "description"?: string
    "placeholder"?: string
    "disabled"?: false | true
    "required"?: false | true
    "context"?: "modal" | "card" | "nude"
    "iconName"?: string
    "formatter"?: unknown
    "step"?: number
    "min"?: number
    "max"?: number
    "enforceBounds"?: false | true
  }
  "DigiOptionalSearchSelectFormField": {
    "name": string
    "zodSchema"?: unknown
    "indications"?: string
    "label": string
    "description"?: string
    "placeholder"?: string
    "disabled"?: false | true
    "required"?: false | true
    "context"?: "modal" | "card" | "nude"
    "selectProps": unknown
  }
  "DigiOptionalTextFormField": {
    "name": string
    "zodSchema"?: unknown
    "indications"?: string
    "label": string
    "description"?: string
    "placeholder"?: string
    "disabled"?: false | true
    "required"?: false | true
    "context"?: "modal" | "card" | "nude"
    "iconName"?: string
    "formatter"?: unknown
  }
  "DigiOverlay": {
    "disabled"?: false | true
    "noPointer"?: false | true
    "show"?: false | true
  }
  "DigiPageHeader": {
    "title": string
    "description"?: string
    "helpLink"?: string
    "feature"?: unknown
    "class"?: any
    "parentRoute"?: unknown
    "parentRouteText"?: string
    "fullWidth"?: false | true
  }
  "DigiPageTabItem": {
    "to": unknown
    "iconName"?: string
    "label": string
    "disableState"?: unknown
    "newTab"?: false | true
    "orientation"?: "horizontal" | "vertical"
  }
  "DigiPagination": {
    "defaultPage"?: number
    "itemsPerPage"?: number
    "total": number
    "disabled"?: false | true
  }
  "DigiPasswordFormField": {
    "name": string
    "zodSchema"?: unknown
    "indications"?: string
    "label": string
    "description"?: string
    "placeholder"?: string
    "disabled"?: false | true
    "required"?: false | true
    "context"?: "modal" | "card" | "nude"
    "iconName"?: string
  }
  "DigiPhoneFormField": {
    "name": string
    "zodSchema"?: unknown
    "indications"?: string
    "label": string
    "description"?: string
    "placeholder"?: string
    "disabled"?: false | true
    "required"?: false | true
    "context"?: "modal" | "card" | "nude"
  }
  "DigiPlaceholderRowCard": {
    "size"?: null | "sm" | "md"
    "iconName"?: string
  }
  "DigiPopover": {
  }
  "DigiPopoverContent": {
    "side"?: "top" | "right" | "bottom" | "left"
    "align"?: "start" | "center" | "end"
    "alignOffset"?: number
    "class"?: any
    "title": string
  }
  "DigiPopoverTrigger": {
    "asChild"?: false | true
    "as"?: unknown
  }
  "DigiRadioFormField": {
  }
  "DigiRadioGroup": {
    "disabled"?: false | true
    "name"?: string
    "required"?: false | true
    "orientation"?: "horizontal" | "vertical"
    "modelValue"?: any
    "class"?: any
  }
  "DigiRadioGroupCardItem": {
    "disabled"?: false | true
    "value"?: unknown
    "name"?: string
    "required"?: false | true
    "class"?: any
    "label": string
    "description"?: string
    "descriptionPlacement"?: "below" | "inside"
    "alignment"?: "left" | "center"
    "iconName"?: string
    "containerClass"?: any
  }
  "DigiRadioGroupFormField": {
    "name": string
    "zodSchema"?: unknown
    "indications"?: string
    "label": string
    "description"?: string
    "placeholder"?: string
    "disabled"?: false | true
    "required"?: false | true
    "context"?: "modal" | "card" | "nude"
    "options": unknown
    "orientation"?: "horizontal" | "vertical"
  }
  "DigiRadioGroupItem": {
    "disabled"?: false | true
    "value"?: unknown
    "name"?: string
    "required"?: false | true
    "class"?: any
    "label": string
    "description"?: string
    "iconName"?: string
  }
  "DigiRadioGroupNudeItem": {
    "disabled"?: false | true
    "value"?: unknown
    "name"?: string
    "required"?: false | true
    "class"?: any
    "containerClass"?: any
  }
  "DigiRemixIcon": {
    "name": string
    "size"?: string
  }
  "DigiRemovableChip": {
    "label": string
  }
  "DigiRouterLink": {
    "to": unknown
    "variant": "primary" | "secondary" | "ghost" | "link"
    "size"?: "sm" | "md" | "lg" | "icon"
    "newTab"?: false | true
    "disabled"?: false | true
    "iconName"?: string
    "class"?: any
  }
  "DigiRowCard": {
    "size"?: null | "sm" | "md"
    "iconName"?: string
    "active"?: false | true
    "disabled"?: false | true
  }
  "DigiRowClickableCard": {
    "name": unknown
    "iconName"?: string
    "size"?: null | "sm" | "md"
    "active"?: false | true
    "disabled"?: false | true
  }
  "DigiRowDraggableCard": {
    "name": unknown
    "size"?: null | "sm" | "md"
    "active"?: false | true
    "disabled"?: false | true
    "enableDrag"?: unknown
    "canBeGrouped"?: false | true
  }
  "DigiSearchField": {
  }
  "DigiSearchSelect": {
    "id"?: string
    "multiple"?: false | true
    "options": unknown
    "valuePlaceholder"?: string
    "searchPlaceholder"?: string
    "emptySearchText"?: string
    "filterFunction"?: unknown
    "state"?: unknown
    "selectedText"?: string
    "disabled"?: false | true
    "triggerIcon"?: string
    "hideBadges"?: false | true
  }
  "DigiSearchSelectFormField": {
    "name": string
    "zodSchema"?: unknown
    "indications"?: string
    "label": string
    "description"?: string
    "placeholder"?: string
    "disabled"?: false | true
    "required"?: false | true
    "context"?: "modal" | "card" | "nude"
    "selectProps": unknown
  }
  "DigiSettingsCard": {
    "title": string
    "description"?: string
    "helpLink"?: string
    "iconName"?: string
    "smallSpacing"?: false | true
    "hideContents"?: false | true
  }
  "DigiSettingsPageLayout": {
    "title"?: string
    "description"?: string
    "helpLink"?: string
    "feature"?: any
    "parentRoute"?: unknown
    "parentRouteText"?: string
    "fullWidth"?: false | true
    "fullWidthHeader"?: false | true
    "class"?: any
  }
  "DigiSettingsRowLayout": {
    "label": string
    "description"?: string
    "helpLink"?: string
    "indications"?: string
    "disabled"?: false | true
    "context"?: "modal" | "card" | "nude"
  }
  "DigiSheet": {
    "title": string
    "description"?: string
    "iconName"?: string
  }
  "DigiSidePanel": {
    "isOpen": false | true
    "side"?: "right" | "left"
    "bodyClass"?: string
  }
  "DigiSidePanelContent": {
  }
  "DigiSidePanelHeader": {
    "title": string
    "noCloseButton"?: false | true
  }
  "DigiSingleSettingRow": {
    "save": unknown
    "name": string
    "zodSchema"?: unknown
    "indications"?: string
    "label": string
    "mode"?: "onBlur" | "onChange"
    "disabled"?: false | true
    "required"?: false | true
    "placeholder"?: string
  }
  "DigiSortable": {
    "itemKey": unknown
    "disabled"?: false | true
    "groupName"?: string
    "spaced"?: false | true
    "canAcceptItems"?: false | true
  }
  "DigiSortableElementPicker": {
    "groupName": string
    "elements": unknown
    "clone": unknown
    "itemKey": unknown
  }
  "DigiSortableHandle": {
  }
  "DigiSpinner": {
    "size"?: null | "sm" | "lg" | "micro"
    "reversed"?: false | true
    "class"?: string
    "hide"?: false | true
  }
  "DigiStarsRenderer": {
    "value": number
    "maxStars": number
  }
  "DigiStepper": {
    "defaultValue"?: number
    "asChild"?: false | true
    "as"?: unknown
    "orientation"?: "horizontal" | "vertical"
    "dir"?: "ltr" | "rtl"
    "linear"?: false | true
    "class"?: any
    "steps": unknown
  }
  "DigiSwitch": {
    "size"?: null | "sm" | "md"
    "disabled"?: false | true
    "class"?: any
    "id"?: string
  }
  "DigiSwitchFormField": {
    "name": string
    "zodSchema"?: unknown
    "indications"?: string
    "label": string
    "description"?: string
    "placeholder"?: string
    "disabled"?: false | true
    "required"?: false | true
    "context"?: "modal" | "card" | "nude"
  }
  "DigiSwitchSingleSettings": {
    "save": unknown
    "name": string
    "zodSchema"?: unknown
    "indications"?: string
    "label": string
    "mode"?: "onBlur" | "onChange"
    "disabled"?: false | true
    "required"?: false | true
    "placeholder"?: string
  }
  "DigiTabContent": {
    "class"?: any
    "value": string | number
    "forceMount"?: false | true
  }
  "DigiTable": {
    "class"?: any
  }
  "DigiTableBody": {
    "class"?: any
  }
  "DigiTableCell": {
    "class"?: any
    "colspan"?: number
    "rowspan"?: number
  }
  "DigiTableEmpty": {
    "class"?: any
    "colspan"?: number
  }
  "DigiTableEmptyRow": {
    "columnsCount": number
    "emptyText"?: string
    "hideReset"?: false | true
  }
  "DigiTableFooter": {
    "class"?: any
  }
  "DigiTableHead": {
    "class"?: any
    "colspan"?: string
  }
  "DigiTableHeader": {
    "class"?: any
  }
  "DigiTablePageLayout": {
    "title"?: string
    "description"?: string
    "helpLink"?: string
    "feature"?: any
    "createCta"?: string
    "parentRoute"?: unknown
    "parentRouteText"?: string
    "fullWidth"?: false | true
    "fullWidthHeader"?: false | true
    "class"?: any
  }
  "DigiTableRow": {
    "class"?: any
  }
  "DigiTabsContainer": {
    "orientation"?: "horizontal" | "vertical"
    "activationMode"?: "automatic" | "manual"
    "tabs": unknown
    "singleLine"?: false | true
  }
  "DigiTabsPageLayout": {
    "title": string
    "description"?: string
    "helpLink"?: string
    "feature"?: any
    "backCta"?: unknown
    "scrollable"?: false | true
    "fullWidthHeader"?: false | true
  }
  "DigiTextFormField": {
    "name": string
    "zodSchema"?: unknown
    "indications"?: string
    "label": string
    "description"?: string
    "placeholder"?: string
    "disabled"?: false | true
    "required"?: false | true
    "context"?: "modal" | "card" | "nude"
    "iconName"?: string
    "formatter"?: unknown
  }
  "DigiTextInput": {
    "name"?: string
    "placeholder"?: string
    "disabled"?: false | true
    "state"?: unknown
    "iconName"?: string
    "min"?: string | number
    "max"?: string | number
    "step"?: number
    "accept"?: string
    "onChange"?: unknown
    "autocomplete"?: string
    "formatter"?: unknown
  }
  "DigiTextPlaceholder": {
    "size"?: string
    "backgroundColor": string
    "width": string
  }
  "DigiTextPlaceholderWrapper": {
    "centered"?: false | true
    "direction"?: "row" | "column"
  }
  "DigiTextTooltip": {
    "text"?: string
    "side"?: "top" | "right" | "bottom" | "left"
    "delay"?: number
    "triggerAsChild"?: false | true
    "class"?: any
  }
  "DigiTextarea": {
    "class"?: any
    "rows"?: number
    "name"?: string
    "placeholder"?: string
    "disabled"?: false | true
    "state"?: unknown
    "iconName"?: string
    "min"?: string | number
    "max"?: string | number
    "step"?: number
    "accept"?: string
    "onChange"?: unknown
    "autocomplete"?: string
  }
  "DigiTextareaFormField": {
    "name": string
    "zodSchema"?: unknown
    "indications"?: string
    "label": string
    "description"?: string
    "placeholder"?: string
    "disabled"?: false | true
    "required"?: false | true
    "context"?: "modal" | "card" | "nude"
    "iconName"?: string
    "rows"?: number
  }
  "DigiTimePickerFormField": {
    "name": string
    "zodSchema"?: unknown
    "indications"?: string
    "label": string
    "description"?: string
    "placeholder"?: string
    "disabled"?: false | true
    "required"?: false | true
    "context"?: "modal" | "card" | "nude"
    "iconName"?: string
  }
  "DigiTimeRangePickerFormField": {
    "name": string
    "zodSchema"?: unknown
    "indications"?: string
    "label": string
    "description"?: string
    "placeholder"?: string
    "disabled"?: false | true
    "required"?: false | true
    "context"?: "modal" | "card" | "nude"
    "day": unknown
    "timezone"?: string
  }
  "DigiTitle": {
    "title": string
  }
  "DigiToast": {
    "class"?: any
    "text": string
    "variant"?: "info" | "destructive" | "warning" | "success"
    "copyable"?: false | true
  }
  "DigiToggle": {
    "class"?: any
    "variant"?: null | "default" | "outline"
    "size"?: null | "sm" | "default"
    "tooltip": string
    "iconName"?: string
    "defaultValue"?: false | true
    "disabled"?: false | true
    "modelValue": false | true
  }
  "DigiToggleGroup": {
    "class"?: any
    "variant"?: null | "default" | "outline"
    "size"?: null | "sm" | "default"
    "type": unknown
    "disabled"?: false | true
    "modelValue": any
  }
  "DigiToggleGroupFormField": {
    "class"?: any
    "variant"?: null | "default" | "outline"
    "size"?: null | "sm" | "default"
    "type": unknown
    "disabled"?: false | true
    "modelValue": any
    "name": string
    "zodSchema"?: unknown
    "indications"?: string
    "label": string
    "description"?: string
    "placeholder"?: string
    "required"?: false | true
    "context"?: "modal" | "card" | "nude"
  }
  "DigiToggleGroupItem": {
    "value": unknown
    "iconName"?: string
    "tooltip"?: string
    "class"?: any
    "variant"?: null | "default" | "outline"
    "size"?: null | "sm" | "default"
  }
  "DigiToggleableFormCard": {
    "title": string
    "description"?: string
    "helpLink"?: string
    "isLoading"?: false | true
    "disabled"?: false | true
    "hasModifications": false | true
    "resetCta"?: string
    "saveCta"?: string
    "smallSpacing"?: false | true
    "hideResetCta"?: false | true
    "toggleTooltip"?: string
  }
  "DigiTooltipIcon": {
    "iconName": string
    "text": string
    "size"?: string
    "side"?: "top" | "right" | "bottom" | "left"
    "delay"?: number
  }
  "DigiTooltipProvider": {
    "delayDuration"?: number
    "skipDelayDuration"?: number
    "disableHoverableContent"?: false | true
    "disableClosingTrigger"?: false | true
    "disabled"?: false | true
    "ignoreNonKeyboardFocus"?: false | true
  }
  "DigiTutorialLink": {
    "helpLink": string
  }
  "DigiUrlFormField": {
    "name": string
    "zodSchema"?: unknown
    "indications"?: string
    "label": string
    "description"?: string
    "placeholder"?: string
    "disabled"?: false | true
    "required"?: false | true
    "context"?: "modal" | "card" | "nude"
    "iconName"?: string
    "enforceHttps"?: false | true
  }
  "DigiUrlInput": {
    "name"?: string
    "placeholder"?: string
    "disabled"?: false | true
    "state"?: unknown
    "iconName"?: string
    "min"?: string | number
    "max"?: string | number
    "step"?: number
    "accept"?: string
    "onChange"?: unknown
    "autocomplete"?: string
  }
  "DigiVerticalMenu": {
    "items": unknown
    "initialOpenedSubKey"?: string
  }
  "DigiVerticalMenuSub": {
    "title": string
    "backLabel"?: string
  }
  "DigiVerticalMenuSubForm": {
    "title": string
    "backLabel"?: string
  }
  "DigiVerticalMenuTab": {
    "title": string
    "icon": string
    "disabled"?: unknown
    "hideCaret"?: false | true
  }
}

export type DigiComponentPropsFor<Name extends DigiComponentName> = DigiComponentProps[Name]
