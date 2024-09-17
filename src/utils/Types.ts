

interface App_User {
  id: number;
  tg_id: number;
  first_name: string;
  username?: string;
  gameData?: number;
  friends: number[];
}

interface GameData {
  id: number;
  mineable: boolean;
  coins: number;
  power: number;
  activeTanker: TankerType | number;
  unlockedTankers: number[];
  lastUpdate: number;
}

interface ValidateDataResponse {
  isValid: boolean
  data: WebAppInitData
}

interface WebAppUser {
  id: number
  is_bot?: boolean
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: true
  added_to_attachment_menu?: true
  allows_write_to_pm?: true
  photo_url?: string
};

interface WebAppChat {
  id: number
  type: string
  title: string
  username?: string
  photo_url?: string
};

interface WebAppInitData {
  [key: string]: any
  query_id?: string
  user: WebAppUser
  receiver?: WebAppUser
  chat?: WebAppChat
  chat_type?: string
  chat_instance?: string
  start_param?: string
  can_send_after?: number
  auth_date?: number
  hash?: string
};

interface TankerType {
  id: number,
  power: number,
  capacity: number,
  speed: number,
  price: number,
  image: string,
  name?: string,
}

export {
  App_User,
  GameData, ValidateDataResponse, WebAppUser, WebAppChat, WebAppInitData, TankerType
};
