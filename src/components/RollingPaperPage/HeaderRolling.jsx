import styles from './HeaderRolling.module.css';
import EmojiPicker from 'emoji-picker-react';
import { useState, useRef, useEffect } from 'react';
import Button from '../common/Button';
import { getReaction, postReaction, getTopReaction } from '../../apis/rollingPaperAPI';
import dropDown from '../../assets/icons/dropDown.svg';
import emojiIcon from '../../assets/icons/emojiIcon.svg';
import toast from '../../Toast/Toast';
import useClickOutside from '../../hooks/useClickOutside';
import shareIcon from '../../assets/icons/share-icon.svg';
import Dropdown from './Dropdown';
import Emoji from '../common/Emoji';
import Profile from '../common/Profile';

const HeaderRolling = ({ rollingInfo }) => {
  const [isEmojiClicked, setIsEmojiClicked] = useState(false);
  const [emojiDropDown, setEmojiDropDown] = useState(false);

  const recipient = rollingInfo.name;
  const writer = rollingInfo.messageCount;
  const recentMessages = rollingInfo.recentMessages;
  const id = rollingInfo.id;

  const [topEmojis, setTopEmojis] = useState([]);
  const [emojiList, setEmojiList] = useState([]);

  const fetchEmoji = async id => {
    const response = await getReaction(id);
    setEmojiList(response);
  };

  const fetchTopEmojis = async id => {
    const response = await getTopReaction(id);
    setTopEmojis(response);
  };

  const [dropdown, setDropdown] = useState(false);
  const handleDropdown = () => {
    setDropdown(true);
  };

  const handleClickShareURL = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    toast.addSuccess('URL이 복사되었습니다.');
  };
  const shareRef = useRef(null);
  useClickOutside(shareRef, setDropdown);

  const handleButtonClick = () => {
    setIsEmojiClicked(prev => !prev);
  };

  const handleEmojiDropDownClick = () => {
    setEmojiDropDown(prev => !prev);
    fetchEmoji(id);
  };

  const onEmojiClick = emoji => {
    postReaction(id, emoji.emoji).then(() => {
      fetchEmoji(id);
      fetchTopEmojis(id);
    });
    setIsEmojiClicked(prev => !prev);
    fetchTopEmojis(id);
  };

  useEffect(() => {
    if (id) fetchTopEmojis(id);
  }, [id]);

  return (
    <>
      <div className={styles.rollingMobileHeader}>
        <div className={styles.recipientMobile}>To. {recipient}</div>
      </div>
      <div className={styles.rollingHeader}>
        <div className={styles.headerContainer}>
          <div className={styles.recipient}>To. {recipient}</div>
          <div className={styles.contentContainer}>
            <Profile recentMessages={recentMessages} messageCount={writer} />
            <div className={styles.writer}>
              <span className={styles.strongSpan}>{writer}</span>명이 작성했어요!
            </div>
            <div className={styles.emojiArea}>
              {topEmojis && <Emoji emoticon={topEmojis} />}
              <img src={dropDown} alt="drop down icon" className={styles.dropDown} onClick={handleEmojiDropDownClick} />
            </div>
             {emojiDropDown && <div className={styles.emojiDropDown}>{emojiList && <Emoji emoticon={emojiList} />}</div>}
            <div>
              <Button onClick={handleButtonClick} size="small" type="outline">
                <img src={emojiIcon} alt="emoji icon" />
                추가
                {isEmojiClicked && (
                  <div className={styles.emojiContainer}>
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                  </div>
                )}
              </Button>
            </div>
            <div ref={shareRef} className={styles.dropDownWrapper}>
              <Button size="small" type="outline" onClick={handleDropdown}>
                <img src={shareIcon} alt="share-icon" />
              </Button>
              {dropdown && <Dropdown name={recipient} onClick={handleClickShareURL} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default HeaderRolling;
