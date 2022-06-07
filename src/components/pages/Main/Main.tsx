import React, { ChangeEvent, useState } from 'react';
import FileSaver from 'file-saver';

import formatDate from '../../../utils/dateFormat';

import MainView from './Main.view';

interface IProps {}

const Main: React.FC<IProps> = () => {
	const [fileState, setFileState] = useState<File>();
	const [resultFileState, setResultFileState] = useState<Blob>();
	const [resultLengthState, setResultLengthState] = useState<number>(0);
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
		const logs: string[] = [];
		let firstTimestampIndex: number | undefined;
		let endTimestampIndex: number | undefined;

		setProccessingFileState(true);
		setFileResultState([]);

		if (!fileState) return alert('File error');

		// Streaming file in chunks, writing file to text & pushing the results by lines into logs array
		await (fileState.stream() as unknown as ReadableStream).pipeThrough(new TextDecoderStream()).pipeTo(
			new WritableStream({
				write(fileInText) {
					if (!fileInText) return alert('File error');

					logs.push(...fileInText.match(/[^\r\n]+/g)!);
				},
			}),
		);

		for (let i = 0; i < logs.length; i++) {
			const formatedStartDate = formatDate(startDateState);
			const formatedEndDate = formatDate(endDateState);

			const startTimestamp = logs[i].match(formatedStartDate);
			const endTimestamp = logs[i].match(formatedEndDate);

			if (startTimestamp) {
				const startTimestampPrevIteration = logs[i - 1]?.match(formatedStartDate);

				if (!startTimestampPrevIteration) firstTimestampIndex = i;
			}

			if (endTimestamp) {
				const endTimestampNextIteration = logs[i + 1]?.match(formatedEndDate);

				if (!endTimestampNextIteration) endTimestampIndex = i + 1;
			}

			if (firstTimestampIndex && endTimestampIndex) break;
		}

		if (firstTimestampIndex !== undefined && endTimestampIndex !== undefined) {
			const resultSeparatedByLines: string[] = [];
			const result = logs.slice(firstTimestampIndex, endTimestampIndex);

			// Adding \r\n to each value in the array for separation by lines
			for (let i = 0; i < result.length; i++) {
				resultSeparatedByLines.push(result[i] + '\r\n');
			}

			const resultFile = new Blob(resultSeparatedByLines, { type: 'text/plain;charset=utf-8' });

			setFileResultState(result);
			setResultFileState(resultFile);
			setResultLengthState(result.length);
			setProccessingFileState(false);
		} else {
			setProccessingFileState(false);
		}
	};

	const onDownloadFile = () => {
		if (!resultFileState) return alert('No File to download');

		FileSaver.saveAs(resultFileState, `Results-${fileNameState}`);
	};

	return (
		<MainView
			fileState={fileState}
			fileNameState={fileNameState}
			resultLengthState={resultLengthState}
			fileResultState={fileResultState}
			startDateState={startDateState}
			setStartDateState={setStartDateState}
			endDateState={endDateState}
			setEndDateState={setEndDateState}
			proccessingFileState={proccessingFileState}
			onUploadFile={onUploadFile}
			onDeleteFile={onDeleteFile}
			onProcessFile={onProcessFile}
			onDownloadFile={onDownloadFile}
		/>
	);
};

Main.displayName = 'Main';
Main.defaultProps = {};

export default React.memo(Main);
