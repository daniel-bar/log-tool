import React, { ChangeEvent, Dispatch } from 'react';

import { DatePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

import { ReactComponent as Upload } from '../../../assets/upload.svg';
import { ReactComponent as DeleteFile } from '../../../assets/delete.svg';
import { ReactComponent as Download } from '../../../assets/download.svg';

import classes from './Main.module.scss';

interface IProps {
	readonly fileState?: File;
	readonly fileNameState?: string;
	readonly resultLengthState?: number;
	readonly fileResultState?: string[];
	readonly startDateState: Date;
	readonly setStartDateState: Dispatch<React.SetStateAction<Date>>;
	readonly endDateState: Date;
	readonly setEndDateState: Dispatch<React.SetStateAction<Date>>;
	readonly proccessingFileState: boolean;
	readonly onDeleteFile: () => void;
	readonly onProcessFile: () => void;
	readonly onUploadFile: (event: ChangeEvent<HTMLInputElement>) => void;
	readonly onDownloadFile: () => void;
}

const MainView: React.FC<IProps> = (props: React.PropsWithChildren<IProps>) => {
	return (
		<div className={classes['mainWrapper']}>
			<div className={classes['innerWrapper']}>
				<h3 className={classes['innerWrapper__title']}>Log Tool</h3>
				<div className={classes['datePickerWrapper']}>
					<DatePicker
						className={classes['datePickerWrapper__datePicker']}
						format="yyyy-MM-dd HH:mm:ss"
						ranges={[]}
						value={props.startDateState ? props.startDateState : new Date()}
						onChange={(date) => props.setStartDateState(date!)}
					/>
					<DatePicker
						className={classes['datePickerWrapper__datePicker']}
						format="yyyy-MM-dd HH:mm:ss"
						ranges={[]}
						value={props.endDateState ? props.endDateState : new Date()}
						onChange={(date) => props.setEndDateState(date!)}
					/>
				</div>
				<div className={classes['uploadFileWrapper']}>
					{props.fileState ? (
						<div className={classes['uploadFileWrapper__fileUploaded']}>
							<div className={classes['uploadFileWrapper__fileUploaded--fileName']}>
								{props.fileNameState}
							</div>
							<DeleteFile
								className={classes['uploadFileWrapper__fileUploaded--deleteFile']}
								onClick={props.onDeleteFile}
							/>
						</div>
					) : (
						<label className={classes['uploadFileWrapper__uploadFile']}>
							<Upload className={classes['uploadFileWrapper__uploadFile--svg']} />
							<div>Upload File</div>
							<input style={{ display: 'none' }} type="file" onChange={props.onUploadFile} />
						</label>
					)}
				</div>
				{props.fileState ? (
					<button
						className={classes['innerWrapper__button']}
						type="button"
						onClick={props.onProcessFile}
					>
						{props.proccessingFileState ? (
							<div className={classes['loader']}>
								<div className={classes['spinner']} />
								<p>Proccessing File</p>
							</div>
						) : (
							'Process File'
						)}
					</button>
				) : (
					<button className={classes['innerWrapper__disabledButton']} type="button" disabled>
						Process File
					</button>
				)}
				<div className={classes['results']}>
					{props.fileResultState?.length === 0 ? (
						<div className={classes['results__noResult']}>No Results</div>
					) : (
						<>
							<div className={classes['results__header']}>
								<div className={classes['results__header--resultsLength']}>
									Results &#40;
									{props.resultLengthState}
									&#41;
								</div>

								<button
									type="button"
									className={classes['results__header--downloadButton']}
									onClick={props.onDownloadFile}
								>
									<Download className={classes['results__header--svg']} />
									Download
								</button>
							</div>
							<ul className={classes['results__rows']}>
								{props.fileResultState!.map((row, index) => (
									<li className={classes['results__row']} key={index}>
										{row}
									</li>
								))}
							</ul>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

MainView.displayName = 'MainView';
MainView.defaultProps = {};

export default React.memo(MainView);
