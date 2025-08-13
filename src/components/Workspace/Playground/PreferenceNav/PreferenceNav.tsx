import { useState, useEffect } from "react";
import { AiOutlineFullscreen, AiOutlineFullscreenExit, AiOutlineSetting } from "react-icons/ai";
import { ISettings } from "../Playground";
import SettingsModal from "@/components/Modals/SettingsModal";
import Languages from '../../../../constants/language';
import Themes from '../../../../constants/themes';
import CustomSelect from "@/components/common/CustomSelect";

type PreferenceNavProps = {
	settings: ISettings;
	language:string;
	setLanguage: React.Dispatch<React.SetStateAction<string>>;
	theme:string;
	setTheme: React.Dispatch<React.SetStateAction<string>>;
	setSettings: React.Dispatch<React.SetStateAction<ISettings>>;
};

const PreferenceNav: React.FC<PreferenceNavProps> = ({ setSettings, settings, language, setLanguage, theme, setTheme }) => {
	const [isFullScreen, setIsFullScreen] = useState(false);

	const languageOptions = Languages.map(lang => ({ value: lang.value, label: lang.languageName }));
	const themeOptions = Themes.map(t => ({ value: t.value, label: t.themeName }));

	const handleFullScreen = () => {
		if (isFullScreen) {
			document.exitFullscreen();
		} else {
			document.documentElement.requestFullscreen();
		}
		setIsFullScreen(!isFullScreen);
	};

	useEffect(() => {
		function exitHandler(e: any) {
			if (!document.fullscreenElement) {
				setIsFullScreen(false);
				return;
			}
			setIsFullScreen(true);
		}

		if (document.addEventListener) {
			document.addEventListener("fullscreenchange", exitHandler);
			document.addEventListener("webkitfullscreenchange", exitHandler);
			document.addEventListener("mozfullscreenchange", exitHandler);
			document.addEventListener("MSFullscreenChange", exitHandler);
		}
	}, [isFullScreen]);

	return (
		<div className='flex items-center justify-between bg-dark-layer-2 text-white h-11 w-full '>
			<div className='flex items-center space-x-4 px-4'>
				<CustomSelect
					options={languageOptions}
					value={language}
					onChange={(value) => setLanguage(value)}
				/>
				<CustomSelect
					options={themeOptions}
					value={theme}
					onChange={(value) => setTheme(value)}
				/>
			</div>

			<div className='flex items-center m-2'>
				<button
					className='preferenceBtn group'
					onClick={() => setSettings({ ...settings, settingsModalIsOpen: true })}
				>
					<div className='h-4 w-4 text-dark-gray-6 font-bold text-lg'>
						<AiOutlineSetting />
					</div>
					<div className='preferenceBtn-tooltip'>Settings</div>
				</button>

				<button className='preferenceBtn group' onClick={handleFullScreen}>
					<div className='h-4 w-4 text-dark-gray-6 font-bold text-lg'>
						{!isFullScreen ? <AiOutlineFullscreen /> : <AiOutlineFullscreenExit />}
					</div>
					<div className='preferenceBtn-tooltip'>Full Screen</div>
				</button>
			</div>
			{settings.settingsModalIsOpen && <SettingsModal settings={settings} setSettings={setSettings} />}
		</div>
	);
};
export default PreferenceNav;