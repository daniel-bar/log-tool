import React, { ChangeEvent, Dispatch } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import classes from './Main.module.scss';

interface IProps {
	readonly fileState?: File;
	readonly fileResultState?: string[];
	readonly startDateState: Date;
	readonly setStartDateState: Dispatch<React.SetStateAction<Date>>;
	readonly endDateState: Date;
	readonly setEndDateState: Dispatch<React.SetStateAction<Date>>;
	readonly onDeleteFile: () => void;
	readonly onProcessFile: () => void;
	readonly onUploadFile: (event: ChangeEvent<HTMLInputElement>) => void;
}

const MainView: React.FC<IProps> = (props: React.PropsWithChildren<IProps>) => {
	return (
		<div className={classes['mainWrapper']}>
			<h1>Log Tool</h1>
			<div className={classes['datePickerWrapper']}>
				<DatePicker
					wrapperClassName={classes['datePickerWrapper__datePicker']}
					selected={props.startDateState}
					timeInputLabel="Time:"
					dateFormat="yyyy-MM-dd HH:mm:ss"
					showTimeInput
					onChange={(date) => props.setStartDateState(date!)}
				/>
				<DatePicker
					wrapperClassName={classes['datePickerWrapper__datePicker']}
					selected={props.endDateState}
					timeInputLabel="Time:"
					dateFormat="yyyy-MM-dd HH:mm:ss"
					showTimeInput
					onChange={(date) => props.setEndDateState(date!)}
				/>
			</div>
			<div className={classes['form']}>
				{props.fileState ? (
					<>
						<label className={classes['form__fileUploaded']}>
							<div>File Uploaded</div>
						</label>
						<button
							className={classes['form__deleteFile']}
							type="button"
							onClick={props.onDeleteFile}
						>
							Delete File
						</button>
					</>
				) : (
					<label className={classes['form__fileInput']}>
						<div>Upload File</div>
						<input style={{ display: 'none' }} type="file" onChange={props.onUploadFile} />
					</label>
				)}

				<button className={classes['form__button']} type="button" onClick={props.onProcessFile}>
					Process File
				</button>

				<div>
					{props.fileResultState?.length === 0 ? (
						<div>No Result</div>
					) : (
						<div>
							{props.fileResultState!.map((row, i) => (
								<p key={i}>{row}</p>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

MainView.displayName = 'MainView';
MainView.defaultProps = {};

export default React.memo(MainView);
