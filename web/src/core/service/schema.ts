// 类型--类
import ServiceSchema from './service-schema'
// 服务
import FontSchema from './font/schema'
import WordCountSchema from './word-count/schema'
import DigestSchema from './digest/schema'
import CounterSchema from './counter/schema'
import QRCodeSchema from './qrcode/schema'
import FaviconSchema from './favicon/schema'
import AreaCodeSchema from './area-code/schema'
import PoemSchema from './poem/schema'
import MIconsSchema from './m-icons/schema'
import IdiomSchema from './idiom/schema'
import Utf8Schema from './utf8/schema'
import TimeSchema from './time/schema'
import BaseConvertSchema from './base-convert/schema'
import PeriodicTableOfElementsSchema from './periodic-table-of-elements/schema'
import TemperatureConvertSchema from './temperature-convert/schema'
import AngleConvertSchema from './angle-convert/schema'
import BMISchema from './bmi/schema'
import NesSchema from './nes/schema'
import GBASchema from './gba/schema'
// 外链服务
import DictSchema from './dict/schema'
import MinesweeperSchema from './minesweeper/schema'
import SvgEditorSchema from './svg-editor/schema'
import SnowmanAttackSchema from './snowman-attack/schema'
import ReaderSchama from './reader/schema'
import GifSchema from './gif/schema'

export default {
  FontSchema,
  WordCountSchema,
  DigestSchema,
  CounterSchema,
  QRCodeSchema,
  FaviconSchema,
  AreaCodeSchema,
  PoemSchema,
  MIconsSchema,
  IdiomSchema,
  Utf8Schema,
  TimeSchema,
  BaseConvertSchema,
  PeriodicTableOfElementsSchema,
  TemperatureConvertSchema,
  AngleConvertSchema,
  BMISchema,
  MinesweeperSchema,
  NesSchema,
  GBASchema,
  DictSchema,
  SvgEditorSchema,
  SnowmanAttackSchema,
  ReaderSchama,
  GifSchema,
} as {
  [x: string]: ServiceSchema
}
