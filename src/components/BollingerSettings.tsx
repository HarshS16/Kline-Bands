import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { BollingerConfig } from './BollingerChart';

interface BollingerSettingsProps {
  config: BollingerConfig;
  onConfigChange: (config: BollingerConfig) => void;
  onClose: () => void;
}

export const BollingerSettings: React.FC<BollingerSettingsProps> = ({
  config,
  onConfigChange,
  onClose
}) => {
  const [localConfig, setLocalConfig] = useState<BollingerConfig>(config);

  const handleInputChange = (field: string, value: any) => {
    const newConfig = { ...localConfig };
    const keys = field.split('.');
    let current: any = newConfig;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    setLocalConfig(newConfig);
  };

  const handleApply = () => {
    onConfigChange(localConfig);
    onClose();
  };

  const ColorPicker = ({ value, onChange }: { value: string; onChange: (color: string) => void }) => (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded border border-border cursor-pointer"
      />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 text-sm"
      />
    </div>
  );

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Bollinger Bands Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="inputs" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger value="inputs" className="data-[state=active]:bg-background">
              Inputs
            </TabsTrigger>
            <TabsTrigger value="style" className="data-[state=active]:bg-background">
              Style
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inputs" className="space-y-6 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Length</Label>
                <Input
                  type="number"
                  value={localConfig.length}
                  onChange={(e) => handleInputChange('length', parseInt(e.target.value))}
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Basic MA Type</Label>
                <Select
                  value={localConfig.maType}
                  onValueChange={(value) => handleInputChange('maType', value)}
                >
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="SMA">SMA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Source</Label>
                <Select
                  value={localConfig.source}
                  onValueChange={(value) => handleInputChange('source', value)}
                >
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="close">Close</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">StdDev (multiplier)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={localConfig.stdDev}
                  onChange={(e) => handleInputChange('stdDev', parseFloat(e.target.value))}
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label className="text-foreground">Offset</Label>
                <Input
                  type="number"
                  value={localConfig.offset}
                  onChange={(e) => handleInputChange('offset', parseInt(e.target.value))}
                  className="bg-input border-border text-foreground"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="style" className="space-y-6 mt-6">
            {/* Basic (Middle Band) */}
            <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <Label className="text-foreground font-medium">Basic (Middle Band)</Label>
                <Switch
                  checked={localConfig.style.basis.visible}
                  onCheckedChange={(checked) => handleInputChange('style.basis.visible', checked)}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Color</Label>
                  <ColorPicker
                    value={localConfig.style.basis.color}
                    onChange={(color) => handleInputChange('style.basis.color', color)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Line Width</Label>
                  <Slider
                    value={[localConfig.style.basis.lineWidth]}
                    onValueChange={([value]) => handleInputChange('style.basis.lineWidth', value)}
                    max={5}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                  <span className="text-xs text-muted-foreground">{localConfig.style.basis.lineWidth}px</span>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Line Style</Label>
                  <Select
                    value={localConfig.style.basis.lineStyle}
                    onValueChange={(value) => handleInputChange('style.basis.lineStyle', value)}
                  >
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="dashed">Dashed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Upper Band */}
            <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <Label className="text-foreground font-medium">Upper Band</Label>
                <Switch
                  checked={localConfig.style.upper.visible}
                  onCheckedChange={(checked) => handleInputChange('style.upper.visible', checked)}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Color</Label>
                  <ColorPicker
                    value={localConfig.style.upper.color}
                    onChange={(color) => handleInputChange('style.upper.color', color)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Line Width</Label>
                  <Slider
                    value={[localConfig.style.upper.lineWidth]}
                    onValueChange={([value]) => handleInputChange('style.upper.lineWidth', value)}
                    max={5}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                  <span className="text-xs text-muted-foreground">{localConfig.style.upper.lineWidth}px</span>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Line Style</Label>
                  <Select
                    value={localConfig.style.upper.lineStyle}
                    onValueChange={(value) => handleInputChange('style.upper.lineStyle', value)}
                  >
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="dashed">Dashed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Lower Band */}
            <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <Label className="text-foreground font-medium">Lower Band</Label>
                <Switch
                  checked={localConfig.style.lower.visible}
                  onCheckedChange={(checked) => handleInputChange('style.lower.visible', checked)}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Color</Label>
                  <ColorPicker
                    value={localConfig.style.lower.color}
                    onChange={(color) => handleInputChange('style.lower.color', color)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Line Width</Label>
                  <Slider
                    value={[localConfig.style.lower.lineWidth]}
                    onValueChange={([value]) => handleInputChange('style.lower.lineWidth', value)}
                    max={5}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                  <span className="text-xs text-muted-foreground">{localConfig.style.lower.lineWidth}px</span>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Line Style</Label>
                  <Select
                    value={localConfig.style.lower.lineStyle}
                    onValueChange={(value) => handleInputChange('style.lower.lineStyle', value)}
                  >
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="dashed">Dashed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Background Fill */}
            <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <Label className="text-foreground font-medium">Background Fill</Label>
                <Switch
                  checked={localConfig.style.fill.visible}
                  onCheckedChange={(checked) => handleInputChange('style.fill.visible', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Opacity</Label>
                <Slider
                  value={[localConfig.style.fill.opacity * 100]}
                  onValueChange={([value]) => handleInputChange('style.fill.opacity', value / 100)}
                  max={100}
                  min={0}
                  step={5}
                  className="mt-2"
                />
                <span className="text-xs text-muted-foreground">{Math.round(localConfig.style.fill.opacity * 100)}%</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleApply} className="bg-primary hover:bg-primary/90">
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};