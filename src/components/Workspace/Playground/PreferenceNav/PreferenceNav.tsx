import { useState, useEffect } from "react";
import { AiOutlineFullscreen, AiOutlineFullscreenExit, AiOutlineSetting } from "react-icons/ai";
import { ISettings } from "../Playground";
import SettingsModal from "@/components/Modals/SettingsModal";
import Languages from '../../../../constants/language';
import Themes from '../../../../constants/themes';

type languageSupport = {
    languageName: string,
    value: string
}

type themeStyle = {
    themeName: string,
    value: string
}
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
		<div className='flex items-center justify-between bg-dark-layer-2 h-11 w-full '>
			<div className='flex items-center'>
					<div className='flex items-center px-1 text-white gap-2'>
						<div>
							<select 
								className="select select-info w-full select-sm max-w-xs bg-dark-fill-3" 
								value={language}
								onChange={(e) => setLanguage(e.target.value)}
							>
								
								{Languages.map((language: languageSupport) => (
									<option key={language.value} value={language.value}> {language.languageName} </option>
								))}
							</select>
                    	</div>
						<div>
							<select 
								className="select select-info w-full select-sm max-w-xs bg-dark-fill-3" 
								value={theme}
								onChange={(e) => setTheme(e.target.value)}
							> 
								{Themes.map((theme: themeStyle) => (
									<option key={theme.value} value={theme.value}> {theme.themeName} </option>
								))}
							</select>
                    	</div>
					</div>
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
