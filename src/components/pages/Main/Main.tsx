import React, { ChangeEvent, useState } from 'react';

import formatDate from '../../../utils/dateFormat';

import MainView from './Main.view';

interface IProps {}

const Main: React.FC<IProps> = () => {
	const [fileState, setFileState] = useState<File>();
	const [fileNameState, setFileNameState] = useState<string>('');
	const [fileResultState, setFileResultState] = useState<string[]>([]);
	const [proccessingFileState, setProccessingFileState] = useState<boolean>(false);

	const [startDateState, setStartDateState] = useState<Date>(new Date());
	const [endDateState, setEndDateState] = useState<Date>(new Date());

	const onUploadFile = (event: ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		const file = event.target.files![0];

		if (!file) return alert('File error');

		setFileNameState(file.name);
		setFileState(file);
	};

	const onDeleteFile = () => {
		setFileState(undefined);
	};

	const onProcessFile = async () => {
		setProccessingFileState(true);
		setFileResultState([]);

		const fileByLines: string[] = [];
		let firstTimestampIndex: number | undefined;
		let endTimestampIndex: number | undefined;

		if (!fileState) return alert('File error');

		// Streaming file in chunks & writing file to text
		await (fileState.stream() as unknown as ReadableStream).pipeThrough(new TextDecoderStream()).pipeTo(
			new WritableStream({
				write(fileInText) {
					if (!fileInText) return alert('File error');

					fileByLines.push(...fileInText.match(/[^\r\n]+/g)!);
				},
			}),
		);

		for (let i = 0; i < fileByLines.length; i++) {
			const startTimestamp = fileByLines[i].match(formatDate(startDateState));
			const endTimestamp = fileByLines[i].match(formatDate(endDateState));

			if (startTimestamp) {
				const startTimestampPrevIteration = fileByLines[i - 1]?.match(formatDate(startDateState));

				if (!startTimestampPrevIteration) firstTimestampIndex = i;
			}

			if (endTimestamp) {
				const endTimestampNextIteration = fileByLines[i + 1]?.match(formatDate(endDateState));

				if (!endTimestampNextIteration) endTimestampIndex = i + 1;
			}

			if (firstTimestampIndex && endTimestampIndex) break;
		}

		if (firstTimestampIndex !== undefined && endTimestampIndex !== undefined) {
			const result = fileByLines.slice(firstTimestampIndex, endTimestampIndex);

			setFileResultState(result);
			setProccessingFileState(false);
		} else {
			setProccessingFileState(false);
		}
	};

	return (
		<MainView
			fileState={fileState}
			fileNameState={fileNameState}
			fileResultState={fileResultState}
			startDateState={startDateState}
			setStartDateState={setStartDateState}
			endDateState={endDateState}
			setEndDateState={setEndDateState}
			proccessingFileState={proccessingFileState}
			onUploadFile={onUploadFile}
			onDeleteFile={onDeleteFile}
			onProcessFile={onProcessFile}
		/>
	);
};

Main.displayName = 'Main';
Main.defaultProps = {};

export default React.memo(Main);
