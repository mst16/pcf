import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import EmailTextField from "./EmailTextField";

export class EmailTextFieldControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	scriptElement: HTMLScriptElement;
	_notifyOutputChanged: () => void;
	_container: HTMLDivElement;
	_currentValue: string | undefined;
	_context: ComponentFramework.Context<IInputs>;

	/**
	 * Empty constructor.
	 */
	constructor() { }

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
		this._context = context;
		this._notifyOutputChanged = notifyOutputChanged;
		this._container = container;

		const webResourceUrl = (window as any).Xrm.Utility.getGlobalContext().getWebResourceUrl(context.parameters.webResource.raw);
		if (webResourceUrl) {
			this.appendScript(webResourceUrl);
		}
	}

	private appendScript(scriptToAppend: string) {
		this.scriptElement = document.createElement("script");
		this.scriptElement.src = scriptToAppend;
		this.scriptElement.async = false;
		document.body.appendChild(this.scriptElement);
	}

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		this._context = context;
		this._currentValue = context.parameters.textValue.raw ?? undefined;

		ReactDOM.render(
			React.createElement(
				EmailTextField,
				{
					context: context,
					value: this._currentValue,
					onChange: this.onChangeValue.bind(this),
					onClick: this.onClick.bind(this),
					additionalClass: (context.parameters.textValue.error) ? "EmailTextField-error" : ""
				}
			),
			this._container
		);
	}

	private onChangeValue(newValue?: string) {
		this._currentValue = newValue;
		if (this._notifyOutputChanged) {
			this._notifyOutputChanged();
		}
	}

	private onClick(value?: string) {
		if (this._context) {
			const functionName = this._context.parameters.functionName.raw;
			if (functionName) {
				let fn = window as any;
				functionName.split('.').forEach((n) => {
					fn = (fn[n]) ? fn[n] : fn;
				});

				if (fn) {
					fn((window as any).Xrm.Page, value);
				}
			}
		}
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs {
		return {
			textValue: this._currentValue ?? ''
		};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		ReactDOM.unmountComponentAtNode(this._container);
		if (this.scriptElement) {
			document.body.removeChild(this.scriptElement);
		}
	}
}