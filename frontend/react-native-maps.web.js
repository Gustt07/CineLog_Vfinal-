// Versao simplificada do react-native-maps para a plataforma web.
import React from "react";
import { View } from "react-native";

const MapView = (props) => React.createElement(View, props);
MapView.Marker = (props) => null;
MapView.Callout = (props) => null;

export const Marker = (props) => null;
export const Callout = (props) => null;
export default MapView;
