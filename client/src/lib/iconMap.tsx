/**
 * resolveServicePageIcons
 * Convertit les icônes stockées en BDD (string) en React elements (lucide-react).
 * Appelé après fetch depuis l'API pour normaliser les données.
 */
import React from "react";
import {
  Mic, Users, Monitor, Music, Star, UtensilsCrossed, Camera,
  Map, Truck, Radio, BarChart2, Store, Eye, TrendingUp,
  Briefcase, Target, Megaphone, ShieldCheck, AlertTriangle,
  FileText, Smartphone, Printer, Layers, Image, Zap,
  Hammer, Package, Sofa, Wrench, Signpost, Lightbulb,
  LayoutGrid, Ruler, Settings, Globe, Mail, Phone,
  Building, Award, Clock, CheckCircle, ArrowRight,
} from "lucide-react";

const ICON_MAP: Record<string, React.ReactNode> = {
  Mic:              <Mic className="w-5 h-5" />,
  Users:            <Users className="w-5 h-5" />,
  Monitor:          <Monitor className="w-5 h-5" />,
  Music:            <Music className="w-5 h-5" />,
  Star:             <Star className="w-5 h-5" />,
  UtensilsCrossed:  <UtensilsCrossed className="w-5 h-5" />,
  Camera:           <Camera className="w-5 h-5" />,
  Map:              <Map className="w-5 h-5" />,
  Truck:            <Truck className="w-5 h-5" />,
  Radio:            <Radio className="w-5 h-5" />,
  BarChart2:        <BarChart2 className="w-5 h-5" />,
  Store:            <Store className="w-5 h-5" />,
  Eye:              <Eye className="w-5 h-5" />,
  TrendingUp:       <TrendingUp className="w-5 h-5" />,
  Briefcase:        <Briefcase className="w-5 h-5" />,
  Target:           <Target className="w-5 h-5" />,
  Megaphone:        <Megaphone className="w-5 h-5" />,
  ShieldCheck:      <ShieldCheck className="w-5 h-5" />,
  AlertTriangle:    <AlertTriangle className="w-5 h-5" />,
  FileText:         <FileText className="w-5 h-5" />,
  Smartphone:       <Smartphone className="w-5 h-5" />,
  Printer:          <Printer className="w-5 h-5" />,
  Layers:           <Layers className="w-5 h-5" />,
  Image:            <Image className="w-5 h-5" />,
  Zap:              <Zap className="w-5 h-5" />,
  Hammer:           <Hammer className="w-5 h-5" />,
  Package:          <Package className="w-5 h-5" />,
  Sofa:             <Sofa className="w-5 h-5" />,
  Wrench:           <Wrench className="w-5 h-5" />,
  Signpost:         <Signpost className="w-5 h-5" />,
  Lightbulb:        <Lightbulb className="w-5 h-5" />,
  LayoutGrid:       <LayoutGrid className="w-5 h-5" />,
  Ruler:            <Ruler className="w-5 h-5" />,
  Settings:         <Settings className="w-5 h-5" />,
  Globe:            <Globe className="w-5 h-5" />,
  Mail:             <Mail className="w-5 h-5" />,
  Phone:            <Phone className="w-5 h-5" />,
  Building:         <Building className="w-5 h-5" />,
  Award:            <Award className="w-5 h-5" />,
  Clock:            <Clock className="w-5 h-5" />,
  CheckCircle:      <CheckCircle className="w-5 h-5" />,
  ArrowRight:       <ArrowRight className="w-5 h-5" />,
};

// Résout une icône string → React element, ou retourne l'icône telle quelle
export function resolveIcon(icon: unknown): React.ReactNode {
  if (typeof icon === "string") {
    return ICON_MAP[icon] ?? <Settings className="w-5 h-5" />;
  }
  return icon as React.ReactNode;
}

// Applique resolveIcon sur tous les serviceBlocks d'un ServicePageData
export function resolveServicePageIcons<T extends { serviceBlocks?: Array<{ icon?: unknown }> }>(
  data: T
): T {
  if (!data?.serviceBlocks) return data;
  return {
    ...data,
    serviceBlocks: data.serviceBlocks.map((block) => ({
      ...block,
      icon: resolveIcon(block.icon),
    })),
  };
}
