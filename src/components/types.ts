import type React from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MessageData = { [key: string]: any }

/** Represents a user or agent responsible for sending given message */
export interface Sender {
  /** id of the sender*/
  id: string
  /** name of the sender if available */
  name?: string
}

export interface AgentTag {
  id?: string | null
  name?: string | null
}

export interface ProcessEntry {
  agent: AgentTag
  origin: string
  result: string
  processor: string
  from_topic?: string
  to_topics?: string[]
  reason?: string[]
}

export enum MessageProcessStatus {
  Running = 'running',
  Completed = 'completed',
  Error = 'error',
}

export enum UpdateType {
  Append = 'append',
  Replace = 'replace',
}

export interface Message {
  id: string
  timestamp: string
  sender: Sender
  conversationId: string
  format: string
  data: MessageData
  inReplyTo?: string
  threads?: string[]
  priority?: string
  recipientList?: AgentTag[]
  topic?: string
  messageHistory?: ProcessEntry[]
  processStatus?: MessageProcessStatus
}

export interface ComponentMap {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: React.ComponentType<any>
}

export interface WebSocketClient {
  send: (message: Message) => void
  close: () => void
  reconnect: () => void
  onReceive?: (handler: (message: Message) => void) => void
}

export interface DataFormat {
  /** Optional title. */
  title?: string
  /** Optional description. */
  description?: string
  /** Optional updateId */
  updateId?: string
  /** Optional updateType */
  updateType?: UpdateType
}

export interface Updates<T extends DataFormat> {
  /** @ignore */
  updatedData?: T[]
}

export interface VisualizationFormat extends DataFormat {
  /** Alternative text for the visualization components used for assistive technology. */
  alt?: string
}

export interface TextFormat extends DataFormat {
  text: string
}

export type TextData = TextFormat & Updates<TextFormat>

export interface CodeFormat extends DataFormat {
  /** Code that will be displayed. */
  code: string
  /** Language type needs to be provided so that the right language extension can be used to format and highlight code.
   * If an unsupported language is used, the code snippet is still viewable. */
  language: string
}

export type CodeData = CodeFormat & Updates<CodeFormat>

export interface CalendarEvent {
  /** Start date and time of the event. */
  start: string
  /** End date and time of the event. */
  end: string
  /** Physical address or online link where the event is happening. */
  location?: string
  /** Title or Name of the event. */
  title?: string
  /** Detailed information about the event. */
  description?: string
  /** Indicator if the event lasts the entire day. */
  isAllDay?: boolean
}

export interface CalendarFormat extends DataFormat {
  events: CalendarEvent[]
}

export type CalendarData = CalendarFormat & Updates<CalendarFormat>

export interface LocationFormat extends VisualizationFormat {
  /** Longitude in decimal degrees. */
  longitude: number
  /** Latitude in decimal degrees. */
  latitude: number
  /** Optional title for the location. */
  title?: string
  /** Optional description for the location. */
  description?: string
}

export interface ImageFormat extends VisualizationFormat {
  /** Base64 encoded image or path to an image file. */
  src: string
  /** Width rendered in pixels. If neither width nor height are provided, the image will be set to be contained in the parent container. */
  width?: number
  /** Height rendered in pixels. */
  height?: number
  /** A function that can be used to get the headers for the url requests. */
  getAuthHeaders?: GetAuthHeaders
}

export interface TableHeader {
  /** Field in table data for this header. */
  dataKey: string
  /** Optional label for this header. */
  label?: string
}

export type TableSortOption = 'asc' | 'desc' | 'col asc' | 'col desc'

export type TableAggregateOption =
  | 'abs sum'
  | 'and'
  | 'any'
  | 'avg'
  | 'count'
  | 'distinct count'
  | 'distinct leaf'
  | 'dominant'
  | 'first'
  | 'high'
  | 'last'
  | 'low'
  | 'or'
  | 'median'
  | 'pct sum parent'
  | 'pct sum grand total'
  | 'stddev'
  | 'sum'
  | 'sum abs'
  | 'sum not null'
  | 'unique'
  | 'var'
  | ['weighted mean', string]

export type TableSort = [string, TableSortOption]

export type FilterOperation =
  | '<'
  | '>'
  | '<='
  | '>='
  | '=='
  | '!='
  | 'is null'
  | 'is not null'
  | 'in'
  | 'not in'
  | 'begins with'
  | 'contains'

export type TableFilter = [
  string,
  FilterOperation,
  string | number | Date | boolean | Array<string | number | Date | boolean>,
]

export type TableConfig = {
  columns?: string[]
  groupBy?: string[]
  splitBy?: string[]
  aggregates?: { [columnName: string]: TableAggregateOption }
  sort?: TableSort[]
  filter?: TableFilter[]
  expansionDepth?: number
  dateColumns?: string[]
  dateStyle?: 'full' | 'long' | 'medium' | 'short' | 'disabled'
}

export interface TableFormat extends VisualizationFormat {
  /** Data to be displayed in the table. */
  data: Array<Record<string, string | number>>
  /** Optional array to set the order of columns and assign labels.
   * This can also be used to limit which columns are shown. */
  headers?: TableHeader[]
  /** Optional object to define how the data should be displayed, grouped, sorted, filtered, and aggregated within the table. */
  config?: TableConfig
}

export type TableData = TableFormat & Updates<TableFormat>

export interface MediaFormat extends DataFormat {
  /** URL of the media file to be played. */
  src: string
  /** URL of the WebVTT captions file (.vtt). */
  captions?: string
  /** Transcript of the media content. */
  transcript?: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AudioFormat extends MediaFormat {}

export interface VideoFormat extends MediaFormat {
  /** URL of an image to be shown while the video is downloading. If not provided, nothing is displayed until the first frame is available. */
  poster?: string
}

export type GetAuthHeaders = () => Promise<{
  headers: {
    Authorization: string
  }
}>

export interface FileData {
  name: string
  url?: string
}

export interface MultipartFormat extends DataFormat {
  /** An array of file data. */
  files: FileData[]
  /** Text content sent along with the files. */
  text?: string
}

export type MultipartData = MultipartFormat & Updates<MultipartFormat>

export interface MultipartProps extends MultipartData {
  /**
   * An object mapping file extensions to their respective viewer components.
   * Each key represents a file type (e.g., 'pdf', 'jpg'), and the corresponding value is a React component
   * that takes a `url` prop and renders the appropriate viewer for that file type. This prop is used to decide
   * which viewer component should be used to open and display the file within the modal.
   */
  supportedViewers?: { [key: string]: React.ComponentType<{ url: string }> }
  /** Setting this to true will display long file names in full. If set to false, long names will be shortened. */
  showFullName?: boolean
  /** A function that can be used to get the headers for the file requests. */
  getAuthHeaders?: GetAuthHeaders
}

export enum ParticipantRole {
  Owner = 'owner',
  Member = 'member',
}

export enum ParticipantType {
  Human = 'human',
  Agent = 'agent',
}

export interface Participant {
  id: string
  displayName: string
  participantType: ParticipantType
  participantRole?: ParticipantRole
  icon?: string
}

export interface BaseInputProps {
  /** Current user. */
  sender: Sender
  /** Id of the current conversation. */
  conversationId: string
  /** Label text to be displayed in the input, which will then move to the top when the input is focused on. If both label and placeholder are provided, the placeholder will only be visible once the input is focused on. */
  label?: string
  /** Placeholder text to be displayed in the input before user starts typing. */
  placeholder?: string
  /** Boolean that dictates whether `TextInput` can expand to be multiline. */
  multiline?: boolean
  /** Maximum number of rows to be displayed. */
  maxRows?: number
  /** Boolean that dictates whether `TextInput` takes up 100% width of the parent container. */
  fullWidth?: boolean
  /** function to send the message */
  send: (message: Message) => void
  /** Additional condition to enable the send button. */
  isSendEnabled?: boolean
  /** Boolean to enable speech-to-text. See which browsers are supported [here](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition#browser_compatibility). */
  enableSpeechToText?: boolean
  /** Specifies the maximum number of emoji search results to display when the user enters a search query. The search query is triggered when the user types in a format like `:text`. */
  maximumEmojiSearchResults?: number
  /** URL to fetch the emoji data from. You need to host the emoji data by yourself. If not provided, the default url will be used. */
  emojiDataSource?: string
  /** Function to fetch the list of members. Should return a promise that resolves to an array of members. */
  getMembers?: () => Promise<Participant[]>
  /** Used to set inReplyTo and messageHistory */
  lastMsg?: Message
  /** If the input should be focused automatically **/
  autoFocus?: boolean
  /** Optional array of thread IDs to associate with the message */
  threads?: string[]
}

export interface TextInputProps
  extends Omit<BaseInputProps, 'send' | 'isSendEnabled'> {
  /** WebSocket connection to send and receive messages to and from a backend.*/
  ws: WebSocketClient
}

export interface UploadOption {
  label: string
  metadata: { [key: string]: any }
  acceptedFileTypes?: string
  iconName?: string
}

export interface UploaderProps {
  /** The types of files that are allowed to be selected for upload. For safety reasons, only allow file types that can be handled by your server. Avoid accepting executable file types like .exe, .bat, or .msi. For more information, refer to the [mdn web docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers). */
  acceptedFileTypes: string
  /** The API endpoint where files will be uploaded. File id will be appended to the end of API endpoint. The response should include the URL of the uploaded file, and the send button will not be enabled until all files have been uploaded. */
  uploadFileEndpoint: string
  /** The API endpoint to delete/cancel uploaded files. File id will be appended to the end of API endpoint. */
  deleteFileEndpoint: string
  /** Used in the API request to link the file with the message that's going to be sent. */
  messageId: string
  /** A function to handle changes in the file list. The parent component should use this to track file names and handle submit accordingly. Url is only required for the 'update' action. */
  onFileUpdate: (
    action: 'add' | 'remove' | 'update',
    fileName: string,
    url?: string
  ) => void
  /** Optional HTML div where the errors should be shown. */
  errorMessagesContainer?: HTMLDivElement
  /** Optional HTML div where the filePreviews should be shown. */
  filePreviewsContainer?: HTMLDivElement
  /** The maximum number of files that can be uploaded in one message. */
  maxFileCount?: number
  /** The maximum size for each uploaded file, in bytes. */
  maxFileSize?: number
  /** Setting this to true will display long file names in full. If set to false, long names will be shortened. */
  showFullName?: boolean
  /** A function that can be used to define additional data to be sent along with the file upload. */
  getUploadData?: (fileName: string) => { [key: string]: any }
  /** A function that can be used to get the headers for the file upload requests. */
  getUploadHeaders?: GetAuthHeaders
  /** Defines the available options for file upload, displayed within a popover menu. If no options are provided, an upload icon button will be displayed by default.*/
  uploadOptions?: UploadOption[]
  /** A function to fetch and format existing file data when a file upload fails due to a conflict error (HTTP status code 409). The returned value will be used to determine a unique file name by appending an incremented number to the base name.  */
  listFiles?: () => Promise<FileData[]>
}

export type MultimodalInputProps = TextInputProps &
  Omit<
    UploaderProps,
    | 'messageId'
    | 'onFileUpdate'
    | 'filePreviewsContainer'
    | 'errorMessagesContainer'
  >

export interface ConversationBaseProps {
  /** WebSocket connection to send and receive messages to and from a backend. This value will be set automatically if the component is rendered with `ElementRenderer` or `MessageSpace`. If not provided, the component may not be able to send or receive messages. */
  ws?: WebSocketClient
  /** Current user. This value will be set automatically if the component is rendered with `ElementRenderer` or `MessageSpace`. */
  sender: Sender
  /** Id of the current conversation. This value will be set automatically if the component is rendered with `ElementRenderer` or `MessageSpace`. */
  conversationId: string
  /** Id of the message. This value will be set automatically if the component is rendered with `ElementRenderer` or `MessageSpace`. */
  messageId: string
}

export interface ConversationPropsWithOptionalWs extends ConversationBaseProps {
  /** WebSocket connection to send response messages to a backend. This value will be set automatically if the component is rendered with `ElementRenderer` or `MessageSpace`. If not provided, the component will not be interactive. */
  ws?: WebSocketClient
}

export interface ConversationPropsWithMandatoryWs
  extends ConversationBaseProps {
  /** WebSocket connection to send and receive messages to and from a backend. This value will be set automatically if the component is rendered with `ElementRenderer` or `MessageSpace`. */
  ws: WebSocketClient
}

export interface QuestionFormat extends DataFormat {
  /** Array of options to choose from. */
  options: (string | number)[]
  /** Selected option. If provided, the component will be disabled */
  data?: string | number
}

export interface QuestionProps
  extends QuestionFormat,
    ConversationPropsWithOptionalWs {}

export interface PromptsFormat {
  /** A list of prompt strings for users to select from. These prompts will be displayed as interactive elements in the UI. */
  prompts: string[]
  position?: 'inConversation' | 'hoverOverInput'
}

export interface PromptsProps
  extends PromptsFormat,
    ConversationPropsWithMandatoryWs {
  /** An optional className to apply to the prompts container. */
  className?: string
}

export interface PDFViewerProps {
  /** The url of the PDF file to be displayed. */
  url: string
  /** A function that can be used to get the headers for the pdf requests. */
  getAuthHeaders?: GetAuthHeaders
}

export interface Weather {
  timestamp: number
  temp: {
    low: number
    high: number
    current?: number
  }
  weatherIcon: {
    icon: string
    description: string
  }
}

export interface WeatherFormat extends DataFormat {
  /** Array of daily weather data. */
  weather: Weather[]
  /** The location from which the weather data is from. */
  location: string
  /** The temperature units of the weather data. */
  units: 'metric' | 'imperial'
}

export type WeatherData = WeatherFormat & Updates<WeatherFormat>

export interface WeatherProps extends WeatherData {
  weatherProvider?: string
}

export interface FormFormat extends DataFormat {
  /** schema describing the form fields */
  schema: any
  /** Response for the form fields */
  data?: any
}

export interface DynamicFormProps
  extends FormFormat,
    ConversationPropsWithOptionalWs {}

interface ContentBase {
  type: 'text' | 'image_url' | 'input_audio' | 'file_url'
}

export interface ContentTextPart extends ContentBase {
  type: 'text'
  text: string
}

export interface ContentImagePart extends ContentBase {
  type: 'image_url'
  image_url: {
    url: string
    detail?: string
  }
}

export interface ContentAudioPart extends ContentBase {
  type: 'input_audio'
  input_audio: {
    data: string
    format: string
  }
}

export interface ContentFilePart extends ContentBase {
  type: 'file_url'
  file_url: {
    url: string
    name?: string
  }
}

export type Content =
  | ContentTextPart
  | ContentImagePart
  | ContentAudioPart
  | ContentFilePart

export interface ChatCompletionRequest {
  /** A list of messages combined into a single displayable message. Supports various content types, including text, images and files. */
  messages: { content: string | Content[]; role: string; name?: string }[]
}

export interface ChatCompletionProps extends DataFormat, ChatCompletionRequest {
  /**
   * An object mapping file extensions to their respective viewer components.
   * Each key represents a file type (e.g., 'pdf', 'jpg'), and the corresponding value is a React component
   * that takes a `url` prop and renders the appropriate viewer for that file type. This prop is used to decide
   * which viewer component should be used to open and display the file within the modal.
   */
  supportedViewers?: { [key: string]: React.ComponentType<{ url: string }> }
  /** Setting this to true will display long file names in full. If set to false, long names will be shortened. */
  showFullName?: boolean
  /** A function that can be used to get the headers for the file requests. */
  getAuthHeaders?: GetAuthHeaders
}
