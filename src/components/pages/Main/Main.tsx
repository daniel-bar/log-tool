import React, { ChangeEvent, useState } from 'react';

import formatDate from '../../../utils/dateFormat';

import MainView from './Main.view';

// const match = lines[i].match(
// 	/[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])/,
// );

interface IProps {}

const Main: React.FC<IProps> = () => {
	const [fileState, setFileState] = useState<File>();
	const [fileResultState, setFileResultState] = useState<string[]>([]);

	const [startDateState, setStartDateState] = useState<Date>(new Date());
	const [endDateState, setEndDateState] = useState<Date>(new Date());

	const onUploadFile = (event: ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		const file = event.target.files![0];

		if (!file) return alert('File error');

		setFileState(file);
	};

	const onDeleteFile = () => {
		setFileState(undefined);
	};

	const onProcessFile = async () => {
		if (!fileState) return alert('File error');

		const fileByLines: string[] = [];

		// Streaming the file in chunks and write in text
		await (fileState.stream() as unknown as ReadableStream).pipeThrough(new TextDecoderStream()).pipeTo(
			new WritableStream({
				write(fileInText) {
					if (!fileInText) return;

					fileByLines.push(...fileInText.match(/[^\r\n]+/g)!);
				},
			}),
		);

		let firstTimestampIndex: number | undefined;
		let endTimestampIndex: number | undefined;

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

		const result = fileByLines.slice(firstTimestampIndex, endTimestampIndex);

		setFileResultState(result);
	};

	return (
		<MainView
			fileState={fileState}
			fileResultState={fileResultState}
			startDateState={startDateState}
			setStartDateState={setStartDateState}
			endDateState={endDateState}
			setEndDateState={setEndDateState}
			onUploadFile={onUploadFile}
			onDeleteFile={onDeleteFile}
			onProcessFile={onProcessFile}
		/>
	);
};

Main.displayName = 'Main';
Main.defaultProps = {};

export default React.memo(Main);
